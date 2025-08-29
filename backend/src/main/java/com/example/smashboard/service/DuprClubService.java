package com.example.smashboard.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class DuprClubService {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, Object>> getClubMembers(String token, String clubId) {
        String url = "https://api.dupr.gg/club/" + clubId + "/members/v1.0/all";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                List.class
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        }

        throw new RuntimeException("Failed to fetch club members: " + response.getStatusCode());
    }
}
