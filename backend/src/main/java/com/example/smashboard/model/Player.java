package com.example.smashboard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long internalId; // DB primary key

    private String externalId;
    private String duprId;
    private String name;
    private Double rating;

    public Player() {
    }

    public Player(String externalId, String name, Double rating, String duprId) {
        this.externalId = externalId;
        this.name = name;
        this.rating = rating;
        this.duprId = duprId;
    }

    // getters & setters
    public Long getInternalId() {
        return internalId;
    }

    public void setInternalId(Long internalId) {
        this.internalId = internalId;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getDuprId() {
        return duprId;
    }

    public void setDuprId(String duprId) {
        this.duprId = duprId;
    }
}
