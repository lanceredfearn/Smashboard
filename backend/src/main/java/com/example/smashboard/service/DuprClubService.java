package com.example.smashboard.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class DuprClubService {

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAllClubMembers(String token, String clubId) {
        String url = "https://api.dupr.gg/club/" + clubId + "/members/v1.0/all";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("Origin", "https://dashboard.dupr.com");
        headers.set("Referer", "https://dashboard.dupr.com/");
        headers.set(HttpHeaders.USER_AGENT,
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36");

        List<Map<String, Object>> allMembers = new ArrayList<>();
        int offset = 0;
        int limit = 25;

        while (true) {
            Map<String, Object> payload = new HashMap<>();
            payload.put("exclude", Collections.emptyList());
            payload.put("limit", limit);
            payload.put("offset", offset);
            payload.put("query", "*");

            // optional filter if required
            Map<String, Object> filter = new HashMap<>();
            filter.put("lat", 30.1221975);
            filter.put("lng", -97.3261298);
            payload.put("filter", filter);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new RuntimeException("Failed to fetch club members: " +
                        response.getStatusCode() + " " + response.getBody());
            }

            Map<String, Object> body = response.getBody();
            if (!"SUCCESS".equals(body.get("status"))) {
                throw new RuntimeException("API error: " + body);
            }

            Map<String, Object> result = (Map<String, Object>) body.get("result");
            List<Map<String, Object>> hits = (List<Map<String, Object>>) result.get("hits");

            if (hits == null || hits.isEmpty()) {
                break; // no more
            }

            allMembers.addAll(hits);

            Boolean hasMore = (Boolean) result.get("hasMore");
            if (hasMore == null || !hasMore) {
                break; // reached the end
            }

            offset += limit; // next page
        }

        return allMembers;
    }
}
