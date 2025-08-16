import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  User, 
  Bot,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { useToast } from '@/hooks/use-toast';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'demo' | 'follow_up' | 'discovery' | 'meeting';
  startTime: Date;
  endTime: Date;
  attendees: string[];
  location?: string;
  isAIScheduled: boolean;
  leadId?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

interface TimeSlot {
  time: string;
  hour: number;
}

export const AgentCalendar = () => {
  const { leads } = useAppData();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ date: Date; hour: number } | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form state for new/edit event
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'demo' as CalendarEvent['type'],
    attendees: '',
    location: '',
    duration: 30,
    notes: ''
  });

  // Generate time slots for the calendar view
  const timeSlots: TimeSlot[] = Array.from({ length: 12 }, (_, i) => ({
    time: `${i + 8}:00`,
    hour: i + 8
  }));

  // Generate sample events
  useEffect(() => {
    const generateEvents = () => {
      const today = new Date();
      const sampleEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Demo Call - TechFlow Solutions',
          type: 'demo',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
          attendees: ['Sarah Johnson', 'VP of Sales'],
          location: 'Zoom Meeting',
          isAIScheduled: true,
          leadId: 'lead-1',
          status: 'confirmed'
        },
        {
          id: '2',
          title: 'Follow-up - DataSync Corp',
          type: 'follow_up',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 15),
          attendees: ['Michael Chen', 'CTO'],
          location: 'Phone Call',
          isAIScheduled: true,
          leadId: 'lead-2',
          status: 'confirmed'
        },
        {
          id: '3',
          title: 'Discovery Call - CloudVenture Inc',
          type: 'discovery',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 45),
          attendees: ['Emily Rodriguez', 'Head of Operations'],
          location: 'Google Meet',
          isAIScheduled: true,
          leadId: 'lead-3',
          status: 'tentative'
        },
        {
          id: '4',
          title: 'Product Demo - InnovateTech',
          type: 'demo',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0),
          attendees: ['James Wilson', 'CEO'],
          location: 'Zoom Meeting',
          isAIScheduled: true,
          leadId: 'lead-4',
          status: 'confirmed'
        },
        {
          id: '5',
          title: 'Check-in Call - ScaleFast Inc',
          type: 'follow_up',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 11, 30),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 12, 0),
          attendees: ['Lisa Park', 'VP Growth'],
          location: 'Phone Call',
          isAIScheduled: false,
          leadId: 'lead-5',
          status: 'confirmed'
        }
      ];
      setEvents(sampleEvents);
    };

    generateEvents();
  }, []);

  const getEventColor = (event: CalendarEvent) => {
    switch (event.type) {
      case 'demo':
        return 'bg-blue-600 border-blue-700 shadow-blue-200';
      case 'follow_up':
        return 'bg-green-600 border-green-700 shadow-green-200';
      case 'discovery':
        return 'bg-purple-600 border-purple-700 shadow-purple-200';
      case 'meeting':
        return 'bg-orange-600 border-orange-700 shadow-orange-200';
      default:
        return 'bg-gray-600 border-gray-700 shadow-gray-200';
    }
  };

  const getEventIcon = (event: CalendarEvent) => {
    if (event.location?.includes('Zoom') || event.location?.includes('Meet')) {
      return <Video className="w-3 h-3" />;
    } else if (event.location?.includes('Phone')) {
      return <Phone className="w-3 h-3" />;
    } else {
      return <MapPin className="w-3 h-3" />;
    }
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const formatDateHeader = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = date.getDate();
    
    return { dayName, dayNumber, isToday };
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      event.startTime.toDateString() === date.toDateString()
    ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.startTime.getHours();
    const startMinute = event.startTime.getMinutes();
    const endHour = event.endTime.getHours();
    const endMinute = event.endTime.getMinutes();
    
    const startPosition = ((startHour - 8) * 60 + startMinute) / 60; // 8 AM = 0
    const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) / 60;
    
    return {
      top: `${startPosition * 64}px`, // 64px per hour (h-16)
      height: `${Math.max(duration * 64 - 4, 32)}px` // Minimum 32px height with gap
    };
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setSelectedTimeSlot({ date, hour });
    setEventForm({
      title: '',
      type: 'demo',
      attendees: '',
      location: 'Zoom Meeting',
      duration: 30,
      notes: ''
    });
    setIsScheduleDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      type: event.type,
      attendees: event.attendees.join(', '),
      location: event.location || '',
      duration: Math.round((event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60)),
      notes: ''
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!selectedTimeSlot || !eventForm.title.trim()) return;

    const startTime = new Date(selectedTimeSlot.date);
    startTime.setHours(selectedTimeSlot.hour, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + eventForm.duration);

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: eventForm.title,
      type: eventForm.type,
      startTime,
      endTime,
      attendees: eventForm.attendees.split(',').map(a => a.trim()).filter(a => a),
      location: eventForm.location,
      isAIScheduled: false,
      status: 'confirmed'
    };

    setEvents(prev => [...prev, newEvent]);
    setIsScheduleDialogOpen(false);
    setSelectedTimeSlot(null);
    
    toast({
      title: "Meeting Scheduled",
      description: `${eventForm.title} has been added to your calendar`,
    });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !eventForm.title.trim()) return;

    const duration = eventForm.duration * 60 * 1000; // Convert to milliseconds
    const endTime = new Date(editingEvent.startTime.getTime() + duration);

    const updatedEvent: CalendarEvent = {
      ...editingEvent,
      title: eventForm.title,
      type: eventForm.type,
      endTime,
      attendees: eventForm.attendees.split(',').map(a => a.trim()).filter(a => a),
      location: eventForm.location,
    };

    setEvents(prev => prev.map(event => 
      event.id === editingEvent.id ? updatedEvent : event
    ));
    setIsEditDialogOpen(false);
    setEditingEvent(null);
    
    toast({
      title: "Meeting Updated",
      description: `${eventForm.title} has been updated`,
    });
  };

  const handleDeleteEvent = () => {
    if (!editingEvent) return;

    setEvents(prev => prev.filter(event => event.id !== editingEvent.id));
    setIsEditDialogOpen(false);
    setEditingEvent(null);
    
    toast({
      title: "Meeting Deleted",
      description: "The meeting has been removed from your calendar",
    });
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      type: 'demo',
      attendees: '',
      location: 'Zoom Meeting',
      duration: 30,
      notes: ''
    });
  };

  const getDisplayDays = () => {
    if (viewMode === 'week') {
      return getWeekDays();
    } else {
      return [currentDate];
    }
  };

  const weekDays = getDisplayDays();

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('week')}
            className={viewMode === 'week' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:text-white' : ''}
          >
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('day')}
            className={viewMode === 'day' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:text-white' : ''}
          >
            Day
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const now = new Date();
              handleTimeSlotClick(now, now.getHours() + 1);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* AI Scheduling Stats */}
      <Alert>
        <Bot className="w-4 h-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>AI has scheduled <strong>12 meetings</strong> this week with <strong>83% show rate</strong></span>
            <Badge variant="secondary">9 of 12 automated</Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="flex">
            {/* Time Column */}
            <div className="w-16 border-r bg-gray-50">
              <div className="h-12 border-b flex items-center justify-center text-xs font-medium text-gray-500">
                Time
              </div>
              {timeSlots.map((slot) => (
                <div key={slot.hour} className="h-16 border-b flex items-start justify-center pt-1">
                  <span className="text-xs text-gray-500">{slot.time}</span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            <div className={`flex-1 grid ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-1'}`}>
              {weekDays.map((day, dayIndex) => {
                const { dayName, dayNumber, isToday } = formatDateHeader(day);
                const dayEvents = getEventsForDay(day);

                return (
                  <div key={dayIndex} className="border-r last:border-r-0">
                    {/* Day Header */}
                    <div className={`h-12 border-b flex flex-col items-center justify-center ${
                      isToday ? 'bg-blue-50' : 'bg-gray-50'
                    }`}>
                      <span className="text-xs font-medium text-gray-600">{dayName}</span>
                      <span className={`text-sm font-semibold ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {dayNumber}
                      </span>
                    </div>

                    {/* Time Slots */}
                    <div className="relative">
                      {timeSlots.map((slot) => (
                        <div 
                          key={slot.hour} 
                          className="h-16 border-b relative hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => handleTimeSlotClick(day, slot.hour)}
                        >
                          {/* Current time indicator */}
                          {isToday && new Date().getHours() === slot.hour && (
                            <div 
                              className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                              style={{
                                top: `${(new Date().getMinutes() / 60) * 60}px`
                              }}
                            >
                              <div className="w-2 h-2 bg-red-500 rounded-full -ml-1 -mt-0.5"></div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Events */}
                      {dayEvents.map((event) => {
                        const position = getEventPosition(event);
                        return (
                          <div
                            key={event.id}
                            className={`absolute left-1 right-1 rounded border-l-4 p-2 text-white cursor-pointer hover:shadow-lg transition-all z-20 ${getEventColor(event)}`}
                            style={position}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-1">
                                {getEventIcon(event)}
                                {event.isAIScheduled && <Bot className="w-3 h-3 text-white" />}
                              </div>
                              <MoreVertical className="w-3 h-3 text-white opacity-80 hover:opacity-100" />
                            </div>
                            <div className="font-semibold text-sm leading-tight text-white mb-1 overflow-hidden">
                              {event.title}
                            </div>
                            <div className="text-xs text-white opacity-95 leading-tight mb-1">
                              {event.startTime.toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </div>
                            {event.attendees[0] && (
                              <div className="text-xs text-white opacity-90 leading-tight truncate">
                                {event.attendees[0]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-sm">Demo Calls</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-sm">Follow-ups</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-600 rounded"></div>
              <span className="text-sm">Discovery Calls</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bot className="w-3 h-3 text-blue-600" />
              <span className="text-sm">AI Scheduled</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Meetings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Today's Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getEventsForDay(new Date()).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No meetings scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {getEventsForDay(new Date()).map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <div className={`w-3 h-3 rounded ${getEventColor(event).split(' ')[0]}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{event.title}</span>
                      {event.isAIScheduled && (
                        <Badge variant="outline" className="text-xs">
                          <Bot className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {event.startTime.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })} - {event.endTime.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })} • {event.attendees[0]}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    {getEventIcon(event)}
                    <span className="text-xs">{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Meeting Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
            <DialogDescription>
              {selectedTimeSlot && (
                <>Schedule a meeting for {selectedTimeSlot.date.toLocaleDateString()} at {selectedTimeSlot.hour}:00</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                className="col-span-3"
                placeholder="Meeting title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select 
                value={eventForm.type} 
                onValueChange={(value: CalendarEvent['type']) => 
                  setEventForm(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">Demo Call</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="discovery">Discovery Call</SelectItem>
                  <SelectItem value="meeting">General Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attendees" className="text-right">Attendees</Label>
              <Input
                id="attendees"
                value={eventForm.attendees}
                onChange={(e) => setEventForm(prev => ({ ...prev, attendees: e.target.value }))}
                className="col-span-3"
                placeholder="Contact name, title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Select 
                value={eventForm.location} 
                onValueChange={(value) => setEventForm(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zoom Meeting">Zoom Meeting</SelectItem>
                  <SelectItem value="Google Meet">Google Meet</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                  <SelectItem value="In Person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration</Label>
              <Select 
                value={eventForm.duration.toString()} 
                onValueChange={(value) => setEventForm(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setIsScheduleDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEvent} 
              disabled={!eventForm.title.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Meeting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogDescription>
              {editingEvent && (
                <>Modify details for {editingEvent.title}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">Title</Label>
              <Input
                id="edit-title"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                className="col-span-3"
                placeholder="Meeting title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">Type</Label>
              <Select 
                value={eventForm.type} 
                onValueChange={(value: CalendarEvent['type']) => 
                  setEventForm(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">Demo Call</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="discovery">Discovery Call</SelectItem>
                  <SelectItem value="meeting">General Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-attendees" className="text-right">Attendees</Label>
              <Input
                id="edit-attendees"
                value={eventForm.attendees}
                onChange={(e) => setEventForm(prev => ({ ...prev, attendees: e.target.value }))}
                className="col-span-3"
                placeholder="Contact name, title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">Location</Label>
              <Select 
                value={eventForm.location} 
                onValueChange={(value) => setEventForm(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zoom Meeting">Zoom Meeting</SelectItem>
                  <SelectItem value="Google Meet">Google Meet</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                  <SelectItem value="In Person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">Duration</Label>
              <Select 
                value={eventForm.duration.toString()} 
                onValueChange={(value) => setEventForm(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editingEvent?.isAIScheduled && (
              <Alert>
                <Bot className="w-4 h-4" />
                <AlertDescription>
                  This meeting was scheduled by AI Agent. Changes will override AI automation.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex justify-between">
            <Button variant="destructive" onClick={handleDeleteEvent}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingEvent(null);
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateEvent} 
                disabled={!eventForm.title.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Meeting
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 