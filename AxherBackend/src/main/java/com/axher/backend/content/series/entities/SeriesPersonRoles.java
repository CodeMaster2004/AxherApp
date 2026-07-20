package com.axher.backend.content.series.entities;

import com.axher.backend.content.people.entities.CinematicRoles;
import com.axher.backend.content.people.entities.Persons;

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
@Table(name = "series_person_roles")
public class SeriesPersonRoles {

	@EmbeddedId
	private SeriesPersonRoleId id = new SeriesPersonRoleId();

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("seriesId")
	@JoinColumn(name = "series_id", nullable = false)
	private Series seriesId;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("personId")
	@JoinColumn(name = "person_id", nullable = false)
	private Persons personId;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("cinematicRoleId")
	@JoinColumn(name = "cinematic_role_id", nullable = false)
	private CinematicRoles cinematicRoleId;

	@Column(name = "character_name", length = 100)
	private String characterName;

	@Column(name = "order_index")
	private Integer orderIndex;

}

