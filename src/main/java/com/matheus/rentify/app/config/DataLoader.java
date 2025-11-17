package com.matheus.rentify.app.config;

import com.matheus.rentify.app.shared.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Profile("!test")
@Component
public class DataLoader implements CommandLineRunner {

    private final DataSource dataSource;
    private final StateRepository stateRepository;
    private final ResourceLoader resourceLoader;

    @Autowired
    public DataLoader(DataSource dataSource, StateRepository stateRepository, ResourceLoader resourceLoader) {
        this.dataSource = dataSource;
        this.stateRepository = stateRepository;
        this.resourceLoader = resourceLoader;
    }

    @Override
    public void run(String... args) throws Exception {
        if (stateRepository.count() == 0) {
            executeSqlScript("classpath:db/states.sql");
            executeSqlScript("classpath:db/cities.sql");
        }
    }

    private void executeSqlScript(String resourcePath) {
        try {
            Resource resource = resourceLoader.getResource(resourcePath);

            try (Connection conn = dataSource.getConnection()) {
                ScriptUtils.executeSqlScript(conn, resource);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to execute SQL script: " + resourcePath, e);
        }
    }
}