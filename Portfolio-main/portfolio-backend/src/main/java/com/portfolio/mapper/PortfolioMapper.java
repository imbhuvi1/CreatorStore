package com.portfolio.mapper;

import com.portfolio.dto.*;
import com.portfolio.entity.*;
import org.springframework.stereotype.Component;

@Component
public class PortfolioMapper {

    public ProjectDto toDto(Project e) {
        return ProjectDto.builder()
                .id(e.getId()).title(e.getTitle()).description(e.getDescription())
                .problemSolved(e.getProblemSolved()).technologies(e.getTechnologies())
                .keyFeatures(e.getKeyFeatures()).role(e.getRole())
                .githubUrl(e.getGithubUrl()).demoUrl(e.getDemoUrl())
                .imageUrl(e.getImageUrl()).category(e.getCategory())
                .displayOrder(e.getDisplayOrder())
                .createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt())
                .build();
    }

    public SkillDto toDto(Skill e) {
        return SkillDto.builder()
                .id(e.getId()).name(e.getName()).category(e.getCategory())
                .level(e.getLevel()).icon(e.getIcon())
                .displayOrder(e.getDisplayOrder()).build();
    }

    public AchievementDto toDto(Achievement e) {
        return AchievementDto.builder()
                .id(e.getId()).title(e.getTitle()).description(e.getDescription())
                .achievedOn(e.getAchievedOn()).proofUrl(e.getProofUrl())
                .icon(e.getIcon()).displayOrder(e.getDisplayOrder()).build();
    }

    public EducationDto toDto(Education e) {
        return EducationDto.builder()
                .id(e.getId()).degree(e.getDegree()).institution(e.getInstitution())
                .location(e.getLocation()).startYear(e.getStartYear())
                .endYear(e.getEndYear()).grade(e.getGrade())
                .description(e.getDescription()).displayOrder(e.getDisplayOrder())
                .build();
    }

    public ExperienceDto toDto(Experience e) {
        return ExperienceDto.builder()
                .id(e.getId()).organization(e.getOrganization()).role(e.getRole())
                .duration(e.getDuration()).location(e.getLocation())
                .responsibilities(e.getResponsibilities()).technologies(e.getTechnologies())
                .achievements(e.getAchievements()).displayOrder(e.getDisplayOrder())
                .build();
    }

    public ExtracurricularActivityDto toDto(ExtracurricularActivity e) {
        return ExtracurricularActivityDto.builder()
                .id(e.getId()).title(e.getTitle()).description(e.getDescription())
                .activityDate(e.getActivityDate()).organization(e.getOrganization())
                .proofUrl(e.getProofUrl()).icon(e.getIcon())
                .displayOrder(e.getDisplayOrder()).build();
    }

    public ServiceOfferingDto toDto(ServiceOffering e) {
        return ServiceOfferingDto.builder()
                .id(e.getId()).name(e.getName()).description(e.getDescription())
                .tools(e.getTools()).startingPrice(e.getStartingPrice())
                .icon(e.getIcon()).displayOrder(e.getDisplayOrder()).build();
    }

    public SocialLinkDto toDto(SocialLink e) {
        return SocialLinkDto.builder()
                .id(e.getId()).platform(e.getPlatform()).url(e.getUrl())
                .icon(e.getIcon()).displayOrder(e.getDisplayOrder()).build();
    }

    public ContactMessageDto toDto(ContactMessage e) {
        return ContactMessageDto.builder()
                .id(e.getId()).name(e.getName()).email(e.getEmail())
                .phone(e.getPhone()).subject(e.getSubject())
                .message(e.getMessage()).isRead(e.getIsRead())
                .createdAt(e.getCreatedAt()).build();
    }
}
