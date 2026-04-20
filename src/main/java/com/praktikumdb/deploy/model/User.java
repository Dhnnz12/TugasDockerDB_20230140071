package com.praktikumdb.deploy.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "20230140071_users")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
}