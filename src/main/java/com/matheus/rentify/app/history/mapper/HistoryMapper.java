package com.matheus.rentify.app.history.mapper;

import com.matheus.rentify.app.history.dto.response.LeaseHistoryResponseDTO;
import com.matheus.rentify.app.history.dto.response.PropertyFinancialsHistoryResponseDTO;
import com.matheus.rentify.app.history.dto.response.PropertyValueHistoryResponseDTO;
import com.matheus.rentify.app.history.model.LeaseHistory;
import com.matheus.rentify.app.history.model.PropertyFinancialsHistory;
import com.matheus.rentify.app.history.model.PropertyValueHistory;
import com.matheus.rentify.app.people.mapper.TenantMapper;
import com.matheus.rentify.app.properties.mapper.PropertyMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring", uses = {PropertyMapper.class, TenantMapper.class})
public interface HistoryMapper {

    LeaseHistoryResponseDTO toLeaseHistoryResponseDTO(LeaseHistory history);

    @Mappings({
            @Mapping(target = "propertyId", source = "history.property.id"),
            @Mapping(target = "propertyAddress", source = "history.property.address")
    })
    PropertyValueHistoryResponseDTO toPropertyValueHistoryResponseDTO(PropertyValueHistory history);

    @Mappings({
            @Mapping(target = "propertyId", source = "history.property.id"),
            @Mapping(target = "propertyAddress", source = "history.property.address")
    })
    PropertyFinancialsHistoryResponseDTO toPropertyFinancialsHistoryResponseDTO(PropertyFinancialsHistory history);
}
