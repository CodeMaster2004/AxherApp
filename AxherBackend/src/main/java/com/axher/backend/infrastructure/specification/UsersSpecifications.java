package com.axher.backend.infrastructure.specification;

import org.springframework.data.jpa.domain.Specification;

import com.axher.backend.users.entities.UserProfiles;
import com.axher.backend.users.entities.Users;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;

public class UsersSpecifications {
    // Buscar por login (email o username)
    public static Specification<Users> loginEquals(String login) {
        return (Root<Users> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            Join<Users, UserProfiles> profileJoin = root.join("profile", JoinType.LEFT);// unir con profile
            return cb.or(
                cb.equal(root.get("email"), login),
                cb.equal(profileJoin.get("username"), login)
            );
        };
    }

    // Buscar por email parcial (LIKE)
    public static Specification<Users> emailLike(String email) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%");
    }

    // Buscar por username parcial (LIKE)
    public static Specification<Users> usernameLike(String username) {
        return (root, query, cb) -> {
            Join<Users, UserProfiles> profileJoin = root.join("profile");
            return cb.like(cb.lower(profileJoin.get("username")), "%" + username.toLowerCase() + "%");
        };
    }

    // Filtrar por rol
    public static Specification<Users> hasRole(String roleName) {
        return (root, query, cb) -> {
            var rolesJoin = root.join("systemRoles");
            return cb.equal(rolesJoin.get("role").get("roleName"), roleName);
        };
    }

    public static Specification<Users> isConfirmed() {
        return (root, query, cb) -> cb.isTrue(root.get("isConfirmed"));
    }
}

