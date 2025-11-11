package com.matheus.rentify.app.leases.service;

import com.matheus.rentify.app.leases.dto.request.PaymentRequestDTO;
import com.matheus.rentify.app.leases.dto.response.PaymentResponseDTO;
import com.matheus.rentify.app.leases.mapper.PaymentMapper;
import com.matheus.rentify.app.leases.model.Payment;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.leases.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final LeaseRepository leaseRepository;
    private final PaymentMapper paymentMapper;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, LeaseRepository leaseRepository, PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.leaseRepository = leaseRepository;
        this.paymentMapper = paymentMapper;
    }

    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO requestDTO) {
        if(!leaseRepository.existsById(requestDTO.leaseId())) {
            throw new EntityNotFoundException("Lease not found with ID: " + requestDTO.leaseId());
        }

        Payment payment = paymentMapper.toEntity(requestDTO);
        Payment savedPayment = paymentRepository.save(payment);

        return paymentMapper.toResponseDTO(savedPayment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getPayments(Long leaseId) {
        List<Payment> payments;

        if(leaseId == null) {
            payments = paymentRepository.findAll(Sort.by(Sort.Direction.DESC, "paymentDate"));
        } else {
            if(!leaseRepository.existsById(leaseId)) {
                throw new EntityNotFoundException("Lease not found with ID: " + leaseId);
            }
            payments = paymentRepository.findByLeaseIdOrderByPaymentDateDesc(leaseId);
        }

        return payments.stream()
                .map(paymentMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentById(Long id) {
        Payment payment = findPaymentByIdOrThrow(id);

        return paymentMapper.toResponseDTO(payment);
    }

    @Transactional
    public PaymentResponseDTO updatePayment(Long id, PaymentRequestDTO requestDTO) {
        Payment payment = findPaymentByIdOrThrow(id);

        paymentMapper.updateEntityFromDto(requestDTO, payment);

        Payment updatedPayment = paymentRepository.save(payment);

        return paymentMapper.toResponseDTO(updatedPayment);
    }

    @Transactional
    public void deletePayment(Long id) {
        Payment payment = findPaymentByIdOrThrow(id);

        paymentRepository.delete(payment);
    }

    private Payment findPaymentByIdOrThrow(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + id));
    }
}
