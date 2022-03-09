package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;


import org.springframework.http.ResponseEntity;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Api(description = "User Commons")
@RequestMapping("/api/usercommons")
@RestController
public class UserCommonsController extends ApiController {

  @Autowired
  private UserCommonsRepository userCommonsRepository;


  @Autowired
  private CommonsRepository commonsRepository;

  @Autowired
  ObjectMapper mapper;

  @ApiOperation(value = "Get a specific user commons (admin only)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping("")
  public UserCommons getUserCommonsById(
      @ApiParam("userId") @RequestParam Long userId,
      @ApiParam("commonsId") @RequestParam Long commonsId) throws JsonProcessingException {

    UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
        .orElseThrow(
            () -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));
    return userCommons;
  }

  @ApiOperation(value = "Get a user commons for current user")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/forcurrentuser")
  public UserCommons getUserCommonsById(
      @ApiParam("commonsId") @RequestParam Long commonsId) throws JsonProcessingException {

    User u = getCurrentUser().getUser();
    Long userId = u.getId();
    UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
        .orElseThrow(
            () -> new EntityNotFoundException(UserCommons.class, "commonsId", commonsId, "userId", userId));
    return userCommons;
  }

  @ApiOperation(value = "Buy/sell a cow, totalWealth updated")
  // @PreAuthorize("hasRole('ROLE_USER')")
  // @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PutMapping("/buy")
  public ResponseEntity<String> putUserCommonsById(
          @ApiParam("commonsId") @RequestParam Long id, 
            @RequestBody @Valid UserCommons incomingUserCommons) throws JsonProcessingException {

        // CollegiateSubredditOrError csoe = new CollegiateSubredditOrError(id);

        // csoe = doesCollegiateSubredditExist(csoe);
        // if (csoe.error != null) {
        //     return csoe.error;
        // }


        //?
        User u = getCurrentUser().getUser();
        Long userId = u.getId();
        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(id, userId)
        .orElseThrow(
            () -> new EntityNotFoundException(UserCommons.class, "commonsId", id, "userId", userId));


        Commons commons = commonsRepository.findById(id).orElseThrow( 
          ()->new EntityNotFoundException(Commons.class, id));
        
        long previousId = userCommons.getId();
        incomingUserCommons.setId(previousId);
        incomingUserCommons.setTotalWealth(incomingUserCommons.getTotalWealth() - commons.getCowPrice());

        userCommonsRepository.save(incomingUserCommons);
        
        String body = mapper.writeValueAsString(incomingUserCommons);
        return ResponseEntity.ok().body(body);
    }

}