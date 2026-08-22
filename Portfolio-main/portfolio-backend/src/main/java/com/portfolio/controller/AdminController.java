package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.ContactMessageDto;
import com.portfolio.entity.*;
import com.portfolio.mapper.PortfolioMapper;
import com.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProjectRepository projectRepo;
    private final SkillRepository skillRepo;
    private final AchievementRepository achievementRepo;
    private final EducationRepository educationRepo;
    private final ExperienceRepository experienceRepo;
    private final ExtracurricularActivityRepository activityRepo;
    private final ServiceOfferingRepository serviceRepo;
    private final SocialLinkRepository socialRepo;
    private final ContactMessageRepository contactRepo;
    private final PortfolioMapper mapper;

    /* ===== Projects ===== */
    @PostMapping("/projects") public ApiResponse<Project> createProject(@RequestBody Project p) { p.setId(null); return ApiResponse.ok(projectRepo.save(p)); }
    @PutMapping("/projects/{id}") public ApiResponse<Project> updateProject(@PathVariable Long id, @RequestBody Project p) { p.setId(id); return ApiResponse.ok(projectRepo.save(p)); }
    @DeleteMapping("/projects/{id}") public ApiResponse<Void> deleteProject(@PathVariable Long id) { projectRepo.deleteById(id); return ApiResponse.ok(null, "deleted"); }

    /* ===== Skills ===== */
    @PostMapping("/skills") public ApiResponse<Skill> createSkill(@RequestBody Skill s) { s.setId(null); return ApiResponse.ok(skillRepo.save(s)); }
    @PutMapping("/skills/{id}") public ApiResponse<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill s) { s.setId(id); return ApiResponse.ok(skillRepo.save(s)); }
    @DeleteMapping("/skills/{id}") public ApiResponse<Void> deleteSkill(@PathVariable Long id) { skillRepo.deleteById(id); return ApiResponse.ok(null, "deleted"); }

    /* ===== Achievements ===== */
    @PostMapping("/achievements") public ApiResponse<Achievement> createAch(@RequestBody Achievement a) { a.setId(null); return ApiResponse.ok(achievementRepo.save(a)); }
    @PutMapping("/achievements/{id}") public ApiResponse<Achievement> updateAch(@PathVariable Long id, @RequestBody Achievement a) { a.setId(id); return ApiResponse.ok(achievementRepo.save(a)); }
    @DeleteMapping("/achievements/{id}") public ApiResponse<Void> deleteAch(@PathVariable Long id) { achievementRepo.deleteById(id); return ApiResponse.ok(null, "deleted"); }

    /* ===== Education ===== */
    @PostMapping("/education") public ApiResponse<Education> createEdu(@RequestBody Education e) { e.setId(null); return ApiResponse.ok(educationRepo.save(e)); }
    @PutMapping("/education/{id}") public ApiResponse<Education> updateEdu(@PathVariable Long id, @RequestBody Education e) { e.setId(id); return ApiResponse.ok(educationRepo.save(e)); }
    @DeleteMapping("/education/{id}") public ApiResponse<Void> deleteEdu(@PathVariable Long id) { educationRepo.deleteById(id); return ApiResponse.ok(null, "deleted"); }

    /* ===== Experience ===== */
    @PostMapping("/experience") public ApiResponse<Experience> createExp(@RequestBody Experience x) { x.setId(null); return ApiResponse.ok(experienceRepo.save(x)); }
    @PutMapping("/experience/{id}") public ApiResponse<Experience> updateExp(@PathVariable Long id, @RequestBody Experience x) { x.setId(id); return ApiResponse.ok(experienceRepo.save(x)); }
    @DeleteMapping("/experience/{id}") public ApiResponse<Void> deleteExp(@PathVariable Long id) { experienceRepo.deleteById(id); return ApiResponse.ok(null, "deleted"); }

    /* ===== Activities ===== */
    @PostMapping("/activities") public ApiResponse<ExtracurricularActivity> createAct(@RequestBody ExtracurricularActivity a) { a.setId(null); return ApiResponse.ok(activityRepo.save(a)); }
    @PutMapping("/activities/{id}") public ApiResponse<ExtracurricularActivity> updateAct(@PathVariable Long id, @RequestBody ExtracurricularActivity a) { a.setId(id); return ApiResponse.ok(activityRepo.save(a)); }
    @DeleteMapping("/activities/{id}") public ApiResponse<Void> deleteAct(@PathVariable Long id) { activityRepo.deleteById(id); return ApiResponse.ok(null, "deleted"); }

    /* ===== Services ===== */
    @PostMapping("/services") public ApiResponse<ServiceOffering> createSvc(@RequestBody ServiceOffering s) { s.setId(null); return ApiResponse.ok(serviceRepo.save(s)); }
    @PutMapping("/services/{id}") public ApiResponse<ServiceOffering> updateSvc(@PathVariable Long id, @RequestBody ServiceOffering s) { s.setId(id); return ApiResponse.ok(serviceRepo.save(s)); }
    @DeleteMapping("/services/{id}") public ApiResponse<Void> deleteSvc(@PathVariable Long id) { serviceRepo.deleteById(id); return ApiResponse.ok(null, "deleted"); }

    /* ===== Social ===== */
    @PostMapping("/social-links") public ApiResponse<SocialLink> createSoc(@RequestBody SocialLink s) { s.setId(null); return ApiResponse.ok(socialRepo.save(s)); }
    @PutMapping("/social-links/{id}") public ApiResponse<SocialLink> updateSoc(@PathVariable Long id, @RequestBody SocialLink s) { s.setId(id); return ApiResponse.ok(socialRepo.save(s)); }
    @DeleteMapping("/social-links/{id}") public ApiResponse<Void> deleteSoc(@PathVariable Long id) { socialRepo.deleteById(id); return ApiResponse.ok(null, "deleted"); }

    /* ===== Contact messages ===== */
    @GetMapping("/messages")
    public ApiResponse<Page<ContactMessageDto>> messages(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "20") int size) {
        Page<ContactMessage> p = contactRepo.findAllByOrderByCreatedAtDesc(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ApiResponse.ok(p.map(mapper::toDto));
    }

    @PatchMapping("/messages/{id}/read")
    public ApiResponse<ContactMessageDto> markRead(@PathVariable Long id) {
        var msg = contactRepo.findById(id)
                .orElseThrow(() -> new com.portfolio.exception.ResourceNotFoundException("Message not found"));
        msg.setIsRead(true);
        return ApiResponse.ok(mapper.toDto(contactRepo.save(msg)));
    }

    @DeleteMapping("/messages/{id}")
    public ApiResponse<Void> deleteMessage(@PathVariable Long id) {
        contactRepo.deleteById(id);
        return ApiResponse.ok(null, "deleted");
    }

    /* ===== Weekly digest ===== */
    @PostMapping("/digest/send-now")
    public ApiResponse<Void> sendDigestNow(com.portfolio.service.DigestService digest) throws Exception {
        digest.sendNow();
        return ApiResponse.ok(null, "digest sent");
    }
}
