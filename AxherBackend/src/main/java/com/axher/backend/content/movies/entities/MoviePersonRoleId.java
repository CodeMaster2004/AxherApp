package com.axher.backend.content.movies.entities;


import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class MoviePersonRoleId implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer movieId;
    private Integer personId;
    private Integer cinematicRoleId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MoviePersonRoleId)) return false;
        MoviePersonRoleId that = (MoviePersonRoleId) o;
        return Objects.equals(movieId, that.movieId) &&
               Objects.equals(personId, that.personId) &&
               Objects.equals(cinematicRoleId, that.cinematicRoleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(movieId, personId, cinematicRoleId);
    }

}
