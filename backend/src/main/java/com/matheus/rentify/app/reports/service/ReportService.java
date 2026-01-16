package com.matheus.rentify.app.reports.service;

import com.matheus.rentify.app.landlord.model.LandlordProfile;
import com.matheus.rentify.app.landlord.repository.LandlordProfileRepository;
import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.leases.model.LeaseStatusEnum;
import com.matheus.rentify.app.leases.model.Payment;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.leases.repository.PaymentRepository;
import com.matheus.rentify.app.properties.model.MaintenanceJob;
import com.matheus.rentify.app.properties.model.MaintenanceStatusEnum;
import com.matheus.rentify.app.properties.repository.MaintenanceJobRepository;
import com.matheus.rentify.app.properties.repository.PropertyRepository;
import com.matheus.rentify.app.reports.dto.response.*;
import com.matheus.rentify.app.reports.model.ActivityTypeEnum;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final PropertyRepository propertyRepository;
    private final PaymentRepository paymentRepository;
    private final MaintenanceJobRepository maintenanceJobRepository;
    private final LeaseRepository leaseRepository;
    private final LandlordProfileRepository landlordRepository; // Nova injeção

    @Autowired
    public ReportService(PropertyRepository propertyRepository,
                         PaymentRepository paymentRepository,
                         MaintenanceJobRepository maintenanceJobRepository,
                         LeaseRepository leaseRepository,
                         LandlordProfileRepository landlordRepository) {
        this.propertyRepository = propertyRepository;
        this.paymentRepository = paymentRepository;
        this.maintenanceJobRepository = maintenanceJobRepository;
        this.leaseRepository = leaseRepository;
        this.landlordRepository = landlordRepository;
    }

    @Transactional(readOnly = true)
    public AnnualIncomeReportResponseDTO generateAnnualIncomeReport(Long landlordId, int year) {
        LandlordProfile profile = landlordRepository.findById(landlordId)
                .orElseThrow(() -> new EntityNotFoundException("Landlord Profile not found"));

        List<Object[]> rawData = paymentRepository.findMonthlyIncomeByLandlordAndYear(landlordId, year);

        Map<Integer, BigDecimal> incomeMap = rawData.stream()
                .collect(Collectors.toMap(
                        row -> (Integer) row[0],
                        row -> (BigDecimal) row[1]
                ));

        List<MonthlyFinancialDataDTO> monthlyData = new ArrayList<>();
        BigDecimal yearTotal = BigDecimal.ZERO;

        Locale brLocale = new Locale("pt", "BR");

        for (int i = 1; i <= 12; i++) {
            BigDecimal income = incomeMap.getOrDefault(i, BigDecimal.ZERO);
            String monthName = Month.of(i).getDisplayName(TextStyle.FULL, brLocale);

            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);

            monthlyData.add(new MonthlyFinancialDataDTO(i, monthName, income));
            yearTotal = yearTotal.add(income);
        }

        return new AnnualIncomeReportResponseDTO(
                year,
                profile.getId(),
                profile.getFullName(),
                yearTotal,
                monthlyData
        );
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponseDTO getDashboardSummary() {
        long totalProps = propertyRepository.countTotalProperties();
        long availableProps = propertyRepository.countAvailableProperties();
        long rentedProps = propertyRepository.countRentedProperties();
        long maintenanceProps = propertyRepository.countMaintenanceProperties();

        double currentOccupancyRate = 0.0;
        if (totalProps > 0) {
            currentOccupancyRate = (double) rentedProps / totalProps * 100;
            currentOccupancyRate = Math.round(currentOccupancyRate * 100.0) / 100.0;
        }

        LocalDate now = LocalDate.now();
        BigDecimal currentRevenue = paymentRepository.sumRevenueByMonthAndYear(now.getMonthValue(), now.getYear());
        if (currentRevenue == null) currentRevenue = BigDecimal.ZERO;

        BigDecimal outstandingMaintenance = maintenanceJobRepository.sumOutstandingCosts(
                Arrays.asList(MaintenanceStatusEnum.PENDING, MaintenanceStatusEnum.IN_PROGRESS)
        );
        if (outstandingMaintenance == null) outstandingMaintenance = BigDecimal.ZERO;

        LocalDate lastMonthDate = now.minusMonths(1);

        BigDecimal lastMonthRevenue = paymentRepository.sumRevenueByMonthAndYear(lastMonthDate.getMonthValue(), lastMonthDate.getYear());
        if (lastMonthRevenue == null) lastMonthRevenue = BigDecimal.ZERO;

        Double revenueChange = calculatePercentageChange(currentRevenue, lastMonthRevenue);

        LocalDate endOfLastMonth = now.withDayOfMonth(1).minusDays(1);
        long rentedLastMonth = leaseRepository.countActiveLeasesOnDate(endOfLastMonth);

        double lastMonthOccupancyRate = 0.0;
        if (totalProps > 0) {
            lastMonthOccupancyRate = (double) rentedLastMonth / totalProps * 100;
        }

        Double occupancyChange = calculatePercentageChange(
                BigDecimal.valueOf(currentOccupancyRate),
                BigDecimal.valueOf(lastMonthOccupancyRate)
        );


        return new DashboardSummaryResponseDTO(
                totalProps,
                availableProps,
                rentedProps,
                currentOccupancyRate,
                maintenanceProps,
                currentRevenue,
                outstandingMaintenance,
                revenueChange,
                occupancyChange
        );
    }

    @Transactional(readOnly = true)
    public List<DashboardActivityResponseDTO> getRecentActivities() {
        List<DashboardActivityResponseDTO> activities = new ArrayList<>();

        List<Payment> recentPayments = paymentRepository.findTop5ByOrderByPaymentDateDesc();
        for (Payment p : recentPayments) {
            activities.add(new DashboardActivityResponseDTO(
                    ActivityTypeEnum.PAYMENT,
                    "Pagamento recebido de " + p.getLease().getTenant().getFullName(),
                    p.getLease().getProperty().getAddress(),
                    p.getAmountPaid(),
                    p.getPaymentDate(),
                    p.getId(),
                    null
            ));
        }

        List<MaintenanceJob> recentJobs = maintenanceJobRepository.findTop5ByOrderByRequestDateDesc();
        for (MaintenanceJob job : recentJobs) {
            activities.add(new DashboardActivityResponseDTO(
                    ActivityTypeEnum.MAINTENANCE,
                    "Manutenção: " + job.getMaintenanceStatus(),
                    job.getServiceDescription(),
                    job.getTotalCost(),
                    job.getRequestDate(),
                    job.getId(),
                    null
            ));
        }

        LocalDate today = LocalDate.now();
        List<Lease> expiringLeases = leaseRepository.findExpiringLeases(
                today,
                today.plusDays(30),
                LeaseStatusEnum.ACTIVE
        );

        for (Lease lease : expiringLeases) {
            long daysLeft = ChronoUnit.DAYS.between(today, lease.getEndDate());
            activities.add(new DashboardActivityResponseDTO(
                    ActivityTypeEnum.EXPIRING_LEASE,
                    "Contrato vencendo",
                    lease.getProperty().getAddress(),
                    null,
                    lease.getEndDate(),
                    lease.getId(),
                    daysLeft
            ));
        }

        return activities.stream()
                .sorted(Comparator.comparing(DashboardActivityResponseDTO::date).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MonthlyFinancialResponseDTO> getFinancialHistory(Integer filterYear) {
        Map<YearMonth, MonthlyFinancialResponseDTO> historyMap = new HashMap<>();

        List<Object[]> revenueData = paymentRepository.findMonthlyRevenueGrouped();
        for (Object[] row : revenueData) {
            Integer year = (Integer) row[0];
            Integer month = (Integer) row[1];
            BigDecimal amount = (BigDecimal) row[2];

            if (filterYear != null && !filterYear.equals(year)) {
                continue;
            }

            YearMonth key = YearMonth.of(year, month);
            historyMap.put(key, new MonthlyFinancialResponseDTO(month, year, amount, BigDecimal.ZERO, amount));
        }

        List<Object[]> expenseData = maintenanceJobRepository.findMonthlyExpensesGrouped();
        for (Object[] row : expenseData) {
            Integer year = (Integer) row[0];
            Integer month = (Integer) row[1];
            BigDecimal amount = (BigDecimal) row[2];

            if (filterYear != null && !filterYear.equals(year)) {
                continue;
            }

            YearMonth key = YearMonth.of(year, month);
            if (historyMap.containsKey(key)) {
                MonthlyFinancialResponseDTO existing = historyMap.get(key);
                BigDecimal netIncome = existing.totalRevenue().subtract(amount);
                historyMap.put(key, new MonthlyFinancialResponseDTO(
                        existing.month(),
                        existing.year(),
                        existing.totalRevenue(),
                        amount,
                        netIncome
                ));
            } else {
                BigDecimal netIncome = BigDecimal.ZERO.subtract(amount);
                historyMap.put(key, new MonthlyFinancialResponseDTO(month, year, BigDecimal.ZERO, amount, netIncome));
            }
        }

        return historyMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(Map.Entry::getValue)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExpiringLeaseResponseDTO> getExpiringLeases(int daysThreshold) {
        LocalDate today = LocalDate.now();
        LocalDate thresholdDate = today.plusDays(daysThreshold);

        List<Lease> leases = leaseRepository.findByEndDateBetweenAndStatus(
                today,
                thresholdDate,
                LeaseStatusEnum.ACTIVE
        );

        return leases.stream()
                .map(lease -> {
                    long daysRemaining = ChronoUnit.DAYS.between(today, lease.getEndDate());

                    return new ExpiringLeaseResponseDTO(
                            lease.getId(),
                            lease.getProperty().getAddress(),
                            lease.getTenant().getFullName(),
                            lease.getEndDate(),
                            daysRemaining
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LatePaymentResponseDTO> getLatePayments(int referenceMonth, int referenceYear) {
        LocalDate today = LocalDate.now();
        List<Lease> activeLeases = leaseRepository.findAllByStatus(LeaseStatusEnum.ACTIVE);
        List<Long> paidLeaseIds = paymentRepository.findLeaseIdsWithPaymentInMonth(referenceMonth, referenceYear);

        Set<Long> paidLeaseIdsSet = new HashSet<>(paidLeaseIds);

        return activeLeases.stream()
                .filter(lease -> !paidLeaseIdsSet.contains(lease.getId()))
                .map(lease -> {
                    LocalDate dueDate = LocalDate.of(referenceYear, referenceMonth, lease.getPaymentDueDay());

                    if (referenceMonth == today.getMonthValue() && referenceYear == today.getYear()) {
                        if (today.getDayOfMonth() <= lease.getPaymentDueDay()) {
                            return null;
                        }
                    }

                    long daysLate = 0;
                    if (today.isAfter(dueDate)) {
                        daysLate = ChronoUnit.DAYS.between(dueDate, today);
                    }

                    return new LatePaymentResponseDTO(
                            lease.getId(),
                            lease.getProperty().getAddress(),
                            lease.getTenant().getFullName(),
                            lease.getPaymentDueDay(),
                            referenceMonth,
                            lease.getBaseRentValue(),
                            daysLate
                    );
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private Double calculatePercentageChange(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }

        BigDecimal difference = current.subtract(previous);
        BigDecimal change = difference.divide(previous, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100));

        return change.setScale(1, RoundingMode.HALF_UP).doubleValue();
    }
}