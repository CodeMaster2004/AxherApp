package com.axher.backend.content.movies.entities;

import com.axher.backend.content.people.entities.CinematicRole;
import com.axher.backend.content.people.entities.Person;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "movie_person_roles")
public class MoviePersonRoles {

	@EmbeddedId
	private MoviePersonRoleId id = new MoviePersonRoleId();

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("movieId")
	@JoinColumn(name = "movie_id", nullable = false)
	private Movies movieId;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("personId")
	@JoinColumn(name = "person_id", nullable = false)
	private Person personId;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("cinematicRoleId")
	@JoinColumn(name = "cinematic_role_id", nullable = false)
	private CinematicRole cinematicRoleId;

	@Column(name = "character_name", length = 100)
	private String characterName;

	@Column(name = "order_index")
	private Integer orderIndex;

}
