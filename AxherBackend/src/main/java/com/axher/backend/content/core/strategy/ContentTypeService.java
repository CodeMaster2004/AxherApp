package com.axher.backend.content.core.strategy;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;

public interface ContentTypeService{

    ContentTypeEnum getType();

    void create(Content content, Object createDto);
    void update(Content content, Object updateDto);
    void delete(Content content);
}



