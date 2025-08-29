package com.example.smashboard.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class DuprAuthService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${dupr.username}")
    private String duprEmail;

    @Value("${dupr.password}")
    private String duprPassword;

    public String loginAndGetToken() {
        Objects.requireNonNull(duprEmail, "DUPR email must be set");
        Objects.requireNonNull(duprPassword, "DUPR password must be set");

        String url = "https://api.dupr.gg/auth/v1.0/login";

        // Use LinkedHashMap to maintain field order similar to browser request
        Map<String, String> request = new LinkedHashMap<>();
        request.put("email", duprEmail);
        request.put("password", duprPassword);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("Origin", "https://dashboard.dupr.com");
        headers.set("Referer", "https://dashboard.dupr.com/");
        headers.set(HttpHeaders.USER_AGENT,
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36");

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Map.class
        );

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> body = response.getBody();
            Map<String, Object> result = (Map<String, Object>) body.get("result");
            if (result != null && result.get("accessToken") != null) {
                return result.get("accessToken").toString();
            }
        }

        throw new RuntimeException("Login failed: " + response.getStatusCode() + " " + response.getBody());
    }
}
