package com.axher.backend.content.series.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class SeriesPersonRoleId implements Serializable {

	private static final long serialVersionUID = 1L;

	private Integer seriesId;
	private Integer personId;
	private Integer cinematicRoleId;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof SeriesPersonRoleId)) return false;
		SeriesPersonRoleId that = (SeriesPersonRoleId) o;
		return Objects.equals(seriesId, that.seriesId) &&
			   Objects.equals(personId, that.personId) &&
			   Objects.equals(cinematicRoleId, that.cinematicRoleId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(seriesId, personId, cinematicRoleId);
	}

}
