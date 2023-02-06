package com.example.datsan.service.impl;

import com.example.datsan.dto.request.BookingOfflineRequest;
import com.example.datsan.dto.request.BookingRequest;
import com.example.datsan.dto.request.PaymentImageRequest;
import com.example.datsan.dto.request.RejectBookingRequest;
import com.example.datsan.dto.response.BookingDetailResponse;
import com.example.datsan.dto.response.BookingResponse;
import com.example.datsan.dto.response.TeamResponse;
import com.example.datsan.entity.Notification;
import com.example.datsan.entity.booking.Booking;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.entity.user.PitchSystemManager;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.BookingRepository;
import com.example.datsan.repository.PitchRepository;
import com.example.datsan.repository.PitchSystemManagerRepository;
import com.example.datsan.repository.UserRepository;
import com.example.datsan.service.*;
import com.example.datsan.util.PitchUtils;
import com.example.datsan.util.TimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PitchRepository pitchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingTeamService bookingTeamService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PitchSystemManagerRepository managerRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserNotificationService userNotificationService;

    @Autowired
    private RevenueService revenueService;

    @Override
    public List<String> addBooking(BookingRequest request, Long userId, Long pitchId) {
        try {
            Pitch pitch = pitchRepository.findPitchById(pitchId);
            User user = userRepository.findUserById(userId);
            List<String> messages = new ArrayList<>();

            Booking booking = new Booking();
            booking.setPitch(pitch);
            booking.setUser(user);

            if (request.getRentDate() == null || request.getRentStart() == null || request.getRentEnd() == null) {
                messages.add("Vui lòng nhập ngày giờ đặt sân");
                return messages;
            }
            if (bookingRepository.isBookingExisted(pitchId, TimeUtils.convertToSqlDate(request.getRentDate()), TimeUtils.convertToTime(request.getRentStart()), TimeUtils.convertToTime(request.getRentEnd()))) {
                messages.add("Sân đã có đơn đặt trong khung thời gian này");
                return messages;
            }
            booking.setRentDate(TimeUtils.convertToSqlDate(request.getRentDate()));
            booking.setRentStart(TimeUtils.convertToTime(request.getRentStart()));
            booking.setRentEnd(TimeUtils.convertToTime(request.getRentEnd()));
            booking.setTotalPrice(request.getTotalPrice());
            booking.setNote(request.getNote());
            booking.setStatus("Awaiting payment");
            booking.setCreatedBy(userId);
            booking.setDeleted(false);

            Booking b = bookingRepository.save(booking);
            b.setCode(PitchUtils.generateBookingCode(pitch.getPitchSystem().getName(), b.getId()));
            if (request.getTeams() != null && request.getTeams().size() > 0) {
                bookingTeamService.addBookingTeam(userId, b, request.getTeams());
            }
            bookingRepository.save(b);
            messages.add("success");
            messages.add(b.getId().toString());
            revenueService.updateRevenueForAddBooking(b.getId());
            List<User> teamMembers = bookingTeamService.getTeamMembers(b.getId());
            if (teamMembers != null && teamMembers.size() > 0) {
                Notification notificationForTeam = notificationService.addNotification(user.getName(), b.getId(), pitch.getName(), pitch.getPitchSystem().getName(),
                        b.getCreatedAt(), null, b.getRentDate(), b.getRentStart(), b.getRentEnd(), "ADDBOOKING", "TEAM");
                for (User member : teamMembers) {
                    userNotificationService.addUserNotification(member, notificationForTeam);
                }
            }
            Notification notificationForManager = notificationService.addNotification(user.getName(), b.getId(), pitch.getName(), pitch.getPitchSystem().getName(),
                    b.getCreatedAt(), null, b.getRentDate(), b.getRentStart(), b.getRentEnd(), "ADDBOOKING", "MANAGER");
            PitchSystemManager owner = managerRepository.findSystemOwner(pitch.getPitchSystem().getId());
            userNotificationService.addUserNotification(owner.getUser(), notificationForManager);
            List<PitchSystemManager> managers = managerRepository.findSystemManager(booking.getPitch().getPitchSystem().getId());
            if (managers != null && managers.size() > 0) {
                for (PitchSystemManager manager : managers) {
                    userNotificationService.addUserNotification(manager.getUser(), notificationForManager);
                }
            }
            return messages;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        List<String> errors =  new ArrayList<>();
        errors.add("Có lỗi xảy ra trong quá trình đặt sân");
        return errors;
    }

    @Override
    public String confirmBooking(Long userId, Long id) {
        String message = "";
        try {
            Booking booking = bookingRepository.findBookingById(id);
            if (booking.getStatus().trim().equals("Rejected")) {
                return "Bạn không thể duyệt đơn đặt sân đã bị huỷ";
            }
            booking.setStatus("Confirmed");
            booking.setUpdatedBy(userId);

            bookingRepository.save(booking);
            message = "success";
            revenueService.updateRevenueForConfirmBooking(id);
            List<User> teamMembers = bookingTeamService.getTeamMembers(id);
            if (teamMembers != null && teamMembers.size() > 0) {
                Notification notificationForTeam = notificationService.addNotification(null, booking.getId(), booking.getPitch().getName(), null,
                        booking.getUpdatedAt(), null, null, null, null, "CONFIRMBOOKING", "TEAM");
                for (User user : teamMembers) {
                    userNotificationService.addUserNotification(user, notificationForTeam);
                }
            }
            Notification notificationForTenant = notificationService.addNotification(null, booking.getId(), booking.getPitch().getName(), null,
                    booking.getUpdatedAt(), null, null, null, null, "CONFIRMBOOKING", "TENANT");
            userNotificationService.addUserNotification(booking.getUser(), notificationForTenant);
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình duyệt đơn đặt sân";
        }
        return message;
    }

    @Override
    public String rejectBooking(Long userId, RejectBookingRequest request) {
        String message;
        try {
            Booking booking = bookingRepository.findBookingById(request.getId());
            User user = userRepository.findUserById(userId);
            if (booking.getStatus().trim().equals("Confirmed")) {
                return "Bạn không thể huỷ đơn đặt sân đã được duyệt";
            }
            if (booking.getStatus().trim().equals("Pending")) {
                return "Bạn không thể huỷ đơn đặt sân đã thanh toán";
            }
            booking.setStatus("Rejected");
            booking.setNote(request.getReason());
            booking.setUpdatedBy(userId);

            bookingRepository.save(booking);
            message = "success";
            revenueService.updateRevenueForRejectBooking(request.getId());
            if (user.getRole().getName().trim().equals("TENANT")) {
                Notification notificationForManager = notificationService.addNotification(user.getName(), booking.getId(), null, null,
                        booking.getCreatedAt(), request.getReason(), null, null, null, "REJECTBOOKING", "MANAGER");
                PitchSystemManager owner = managerRepository.findSystemOwner(booking.getPitch().getPitchSystem().getId());
                userNotificationService.addUserNotification(owner.getUser(), notificationForManager);
                List<PitchSystemManager> managers = managerRepository.findSystemManager(booking.getPitch().getPitchSystem().getId());
                if (managers != null && managers.size() > 0) {
                    for (PitchSystemManager manager : managers) {
                        userNotificationService.addUserNotification(manager.getUser(), notificationForManager);
                    }
                }
                List<User> teamMembers = bookingTeamService.getTeamMembers(request.getId());
                if (teamMembers != null && teamMembers.size() > 0) {
                    Notification notificationForTeam = notificationService.addNotification(user.getName(), booking.getId(), null, null,
                            booking.getCreatedAt(), request.getReason(), null, null, null, "REJECTBOOKING", "TEAM");
                    for (User member : teamMembers) {
                        userNotificationService.addUserNotification(member, notificationForTeam);
                    }
                }
            } else {
                Notification notificationForTenant = notificationService.addNotification(null, booking.getId(), null, null,
                        booking.getCreatedAt(), request.getReason(), null, null, null, "REJECTBOOKING", "TENANT");
                userNotificationService.addUserNotification(booking.getUser(), notificationForTenant);
                List<User> teamMembers = bookingTeamService.getTeamMembers(request.getId());
                if (teamMembers != null && teamMembers.size() > 0) {
                    for (User member : teamMembers) {
                        userNotificationService.addUserNotification(member, notificationForTenant);
                    }
                }
            }
            return message;
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình huỷ đơn đặt sân";
        }
        return message;
    }

    @Override
    public List<BookingResponse> getListBookings(Long id, Long sid, String status, String bookingDate, Pageable pageable) {
        List<BookingResponse> responses = new ArrayList<>();
        try {
            List<Booking> bookings = bookingRepository.getListBookings(id, sid, status, TimeUtils.convertToSqlDate(bookingDate), pageable);
            if (bookings.size() > 0) {
                for (Booking booking : bookings) {
                    BookingResponse response = PitchUtils.convertToBookingResponse(booking);
                    responses.add(response);
                }
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public BookingDetailResponse getBookingDetail(Long uid, Long id) {
        BookingDetailResponse response;
        try {
            Booking booking = bookingRepository.findBookingById(id);
            Date currentDate = Calendar.getInstance().getTime();
            java.sql.Date sqlDate = new java.sql.Date(currentDate.getTime());
            Time currentTime = Time.valueOf(LocalTime.now());
            boolean enableRating = bookingRepository.isBookingEnableRating(id, uid, sqlDate, currentTime);
            List<TeamResponse> teams = bookingTeamService.getListBookingTeams(id);
            response = PitchUtils.convertToBookingDetail(booking, enableRating, teams);
            return response;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<BookingResponse> getBookingsByStatus(Long id, String status, Integer page, String condition) {
        List<BookingResponse> responses = new ArrayList<>();
        try {
            Date date = Calendar.getInstance().getTime();
            java.sql.Date sqlDate = new java.sql.Date(date.getTime());
            Time currentTime = Time.valueOf(LocalTime.now());
            List<Booking> bookings = new ArrayList<>();
            if (!status.equals("Confirmed")) {
                Pageable pageable = PageRequest.of(page - 1, 9, Sort.by("updatedAt").descending());
                bookings = bookingRepository.getBookingHistory(id, status, pageable);
            } else {
                if (condition.equals("future")) {
                    Pageable pageable = PageRequest.of(page - 1, 9, Sort.by("rentDate").ascending());
                    bookings = bookingRepository.getFutureBooking(id, status, sqlDate, currentTime, pageable);
                }
                if (condition.equals("past")) {
                    Pageable pageable = PageRequest.of(page - 1, 9, Sort.by("rentDate").descending());
                    bookings = bookingRepository.getPastBooking(id, status, sqlDate, currentTime, pageable);
                }
            }
            if (bookings.size() > 0) {
                for (Booking booking : bookings) {
                    BookingResponse response = PitchUtils.convertToBookingResponse(booking);
                    responses.add(response);
                }
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

    @Override
    public List<String> addBookingPayment(PaymentImageRequest request) {
        List<String> messages = new ArrayList<>();
        try {
            Booking booking = bookingRepository.findBookingByCode(request.getCode());
            if (booking.getStatus().trim().equals("Rejected")) {
                messages.add("Đơn đặt sân này đã bị huỷ");
                return messages;
            }
            if (booking.getStatus().trim().equals("Pending")) {
                messages.add("Đơn đặt sân đã thanh toán và đang chờ quản lí sân duyệt");
                return messages;
            }
            if (booking.getStatus().trim().equals("Confirmed")) {
                messages.add("Đơn đặt sân đã được duyệt");
                return messages;
            }
            booking.setPayment(request.getUrl());
            booking.setStatus("Pending");
            booking.setUpdatedBy(booking.getUser().getId());
            bookingRepository.save(booking);
            messages.add("success");
            messages.add(booking.getId().toString());
            Notification notificationForManager = notificationService.addNotification(booking.getUser().getName(), booking.getId(), null, null,
                    booking.getCreatedAt(), null, null, null, null, "ADDPAYMENT", "MANAGER");
            PitchSystemManager owner = managerRepository.findSystemOwner(booking.getPitch().getPitchSystem().getId());
            userNotificationService.addUserNotification(owner.getUser(), notificationForManager);
            List<PitchSystemManager> managers = managerRepository.findSystemManager(booking.getPitch().getPitchSystem().getId());
            if (managers != null && managers.size() > 0) {
                for (PitchSystemManager manager : managers) {
                    userNotificationService.addUserNotification(manager.getUser(), notificationForManager);
                }
            }
            return messages;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        List<String> errors =  new ArrayList<>();
        errors.add("Có lỗi xảy ra trong quá trình thanh toán");
        return errors;
    }

    @Override
    public Boolean checkBookingExisted(Long id, String rentDate, String rentStart, String rentEnd) {
        try {
            return bookingRepository.isBookingExisted(id, TimeUtils.convertToSqlDate(rentDate), TimeUtils.convertToTime(rentStart), TimeUtils.convertToTime(rentEnd));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<BookingResponse> getBookingsForTenant(Long pId, String date) {
        try {
            List<Booking> bookings = bookingRepository.getBookingsForTenant(pId, TimeUtils.convertToSqlDate(date));
            List<BookingResponse> responses = new ArrayList<>();
            if (bookings.size() > 0) {
                for (Booking booking : bookings) {
                    BookingResponse response = PitchUtils.convertToBookingResponse(booking);
                    responses.add(response);
                }
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public String addBookingOffline(BookingOfflineRequest request, Long uid, Long pid) {
        try {
            Pitch pitch = pitchRepository.findPitchById(pid);
            User user = new User();
            if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
                user = userRepository.findUserByPhone(request.getPhone());
            }

            Booking booking = new Booking();
            booking.setPitch(pitch);
            if (user != null) {
                booking.setUser(user);
            }
            if (request.getRentDate() == null || request.getRentStart() == null || request.getRentEnd() == null) {
                return "Vui lòng nhập ngày giờ đặt sân";
            }
            if (bookingRepository.isBookingExisted(pid, TimeUtils.convertToSqlDate(request.getRentDate()), TimeUtils.convertToTime(request.getRentStart()), TimeUtils.convertToTime(request.getRentEnd()))) {
                return "Sân đã có đơn đặt trong khung thời gian này";
            }
            booking.setRentDate(TimeUtils.convertToSqlDate(request.getRentDate()));
            booking.setRentStart(TimeUtils.convertToTime(request.getRentStart()));
            booking.setRentEnd(TimeUtils.convertToTime(request.getRentEnd()));
            booking.setTotalPrice(request.getTotalPrice());
            booking.setNote(request.getNote());
            booking.setPayment(request.getPayment());
            booking.setStatus("Confirmed");
            booking.setCreatedBy(uid);
            booking.setDeleted(false);

            Booking b = bookingRepository.save(booking);
            b.setCode(PitchUtils.generateBookingCode(pitch.getPitchSystem().getName(), b.getId()));
            if (request.getTeams() != null && request.getTeams().size() > 0) {
                bookingTeamService.addBookingTeam(uid, b, request.getTeams());
            }
            bookingRepository.save(b);
            revenueService.updateRevenueForAddBooking(b.getId());
            return "success";
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "Có lỗi xảy ra trong quá trình đặt sân trực tiếp";
    }

    @Override
    public List<String> getManagerTokensForBookingDetail(Long bid) {
        try {
            List<String> tokens = new ArrayList<>();
            Booking booking = bookingRepository.findBookingById(bid);
            PitchSystemManager owner = managerRepository.findSystemOwner(booking.getPitch().getPitchSystem().getId());
            List<PitchSystemManager> managers = managerRepository.findSystemManager(booking.getPitch().getPitchSystem().getId());
            List<String> tokenOwners = tokenService.getTokenByUserId(owner.getUser().getId());
            if (tokenOwners != null && tokenOwners.size() > 0) {
                for (String a : tokenOwners) {
                    tokens.add(a);
                }
            }
            if (managers != null && managers.size() > 0) {
                for (PitchSystemManager manager : managers) {
                    List<String> tokenManagers = tokenService.getTokenByUserId(manager.getUser().getId());
                    if (tokenManagers != null && tokenManagers.size() > 0) {
                        for (String b : tokenManagers) {
                            tokens.add(b);
                        }
                    }
                }
            }
            return tokens;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<String> getManagerTokensForAddBooking(Long bid) {
        try {
            List<String> tokens = new ArrayList<>();
            Booking booking = bookingRepository.findBookingById(bid);
            PitchSystemManager owner = managerRepository.findSystemOwner(booking.getPitch().getPitchSystem().getId());
            List<PitchSystemManager> managers = managerRepository.findSystemManager(booking.getPitch().getPitchSystem().getId());
            List<String> tokenOwners = tokenService.getTokenByUserId(owner.getUser().getId());
            if (tokenOwners != null && tokenOwners.size() > 0) {
                for (String a : tokenOwners) {
                    tokens.add(a);
                }
            }
            if (managers != null && managers.size() > 0) {
                for (PitchSystemManager manager : managers) {
                    List<String> tokenManagers = tokenService.getTokenByUserId(manager.getUser().getId());
                    if (tokenManagers != null && tokenManagers.size() > 0) {
                        for (String b : tokenManagers) {
                            tokens.add(b);
                        }
                    }
                }
            }
            return tokens;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<String> getTokensForAddPayment(String code) {
        try {
            List<String> tokens = new ArrayList<>();
            Booking booking = bookingRepository.findBookingByCode(code);
            PitchSystemManager owner = managerRepository.findSystemOwner(booking.getPitch().getPitchSystem().getId());
            List<PitchSystemManager> managers = managerRepository.findSystemManager(booking.getPitch().getPitchSystem().getId());
            List<String> tokenOwners = tokenService.getTokenByUserId(owner.getUser().getId());
            if (tokenOwners != null && tokenOwners.size() > 0) {
                for (String a : tokenOwners) {
                    tokens.add(a);
                }
            }
            if (managers != null && managers.size() > 0) {
                for (PitchSystemManager manager : managers) {
                    List<String> tokenManagers = tokenService.getTokenByUserId(manager.getUser().getId());
                    if (tokenManagers != null && tokenManagers.size() > 0) {
                        for (String b : tokenManagers) {
                            tokens.add(b);
                        }
                    }
                }
            }
            return tokens;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<String> getTeamTokensForAddBooking(Long bid) {
        try {
            List<String> tokens = new ArrayList<>();
            List<User> teamMembers = bookingTeamService.getTeamMembers(bid);
            if (teamMembers != null && teamMembers.size() > 0) {
                for (User member : teamMembers) {
                    List<String> tokenMembers = tokenService.getTokenByUserId(member.getId());
                    if (tokenMembers != null && tokenMembers.size() > 0) {
                        for (String c : tokenMembers) {
                            tokens.add(c);
                        }
                    }
                }
            }
            return tokens;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<String> getTokensForBookingDetail(Long bid) {
        try {
            List<String> tokens = new ArrayList<>();
            Booking booking = bookingRepository.findBookingById(bid);
            if (booking != null) {
                tokens = tokenService.getTokenByUserId(booking.getUser().getId());
            }
            return tokens;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public boolean checkBookingRejected(String code) {
        try{
            Booking booking = bookingRepository.findBookingByCode(code);
            if(!booking.getStatus().trim().equals("Rejected")){
                return false;
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return true;
    }
}
