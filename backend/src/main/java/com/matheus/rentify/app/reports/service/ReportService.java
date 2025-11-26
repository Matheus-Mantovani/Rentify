package com.matheus.rentify.app.reports.service;

import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.leases.model.LeaseStatusEnum;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.leases.repository.PaymentRepository;
import com.matheus.rentify.app.properties.model.MaintenanceStatusEnum;
import com.matheus.rentify.app.properties.repository.MaintenanceJobRepository;
import com.matheus.rentify.app.properties.repository.PropertyRepository;
import com.matheus.rentify.app.reports.dto.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final PropertyRepository propertyRepository;
    private final PaymentRepository paymentRepository;
    private final MaintenanceJobRepository maintenanceJobRepository;
    private final LeaseRepository leaseRepository;

    @Autowired
    public ReportService(PropertyRepository propertyRepository, PaymentRepository paymentRepository, MaintenanceJobRepository maintenanceJobRepository, LeaseRepository leaseRepository) {
        this.propertyRepository = propertyRepository;
        this.paymentRepository = paymentRepository;
        this.maintenanceJobRepository = maintenanceJobRepository;
        this.leaseRepository = leaseRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponseDTO getDashboardSummary() {
        long totalProps = propertyRepository.countTotalProperties();
        long availableProps = propertyRepository.countAvailableProperties();
        long rentedProps = propertyRepository.countRentedProperties();
        long maintenanceProps = propertyRepository.countMaintenanceProperties();

        double occupancyRate = 0.0;
        if (totalProps > 0) {
            occupancyRate = (double) rentedProps / totalProps * 100;
            BigDecimal bd = new BigDecimal(occupancyRate).setScale(2, RoundingMode.HALF_UP);
            occupancyRate = bd.doubleValue();
        }

        LocalDate now = LocalDate.now();
        BigDecimal currentMonthRevenue = paymentRepository.sumRevenueByMonthAndYear(now.getMonthValue(), now.getYear());
        if (currentMonthRevenue == null) {
            currentMonthRevenue = BigDecimal.ZERO;
        }

        BigDecimal outstandingMaintenance = maintenanceJobRepository.sumOutstandingCosts(Arrays.asList(MaintenanceStatusEnum.PENDING, MaintenanceStatusEnum.IN_PROGRESS));
        if (outstandingMaintenance == null) {
            outstandingMaintenance = BigDecimal.ZERO;
        }

        return new DashboardSummaryResponseDTO(
                totalProps,
                availableProps,
                rentedProps,
                occupancyRate,
                maintenanceProps,
                currentMonthRevenue,
                outstandingMaintenance
        );
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
}