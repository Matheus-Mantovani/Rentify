package com.matheus.rentify.app.auth.service;

import com.matheus.rentify.app.auth.dto.request.RegisterRequestDTO;
import com.matheus.rentify.app.auth.model.User;
import com.matheus.rentify.app.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(RegisterRequestDTO request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalStateException("Username already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setUsername(request.username());
        user.setEmail(request.email());

        user.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(user);
    }
}