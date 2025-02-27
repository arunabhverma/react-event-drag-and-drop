"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { EventSourceInput } from '@fullcalendar/core/index.js'
import listPlugin from '@fullcalendar/list';




interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  backgroundColor: string; // Ensure each event has a backgroundColor property
}

export default function Home() {
  const [events, setEvents] = useState([
  { title: 'Conference', id: '1', backgroundColor: '#ff5733' },
  { title: 'Meeting', id: '2', backgroundColor: '#33ff57' },
  { title: 'Workshop', id: '3', backgroundColor: '#3357ff' },
  { title: 'Webinar', id: '4', backgroundColor: '#ff33ff' },
  { title: 'Networking Event', id: '5', backgroundColor: '#ff9933' },
  { title: 'Team Building', id: '6', backgroundColor: '#33ccff' },
  { title: 'Product Launch', id: '7', backgroundColor: '#ff3333' },
  { title: 'Client Meeting', id: '8', backgroundColor: '#33ff99' },
  { title: 'Annual Review', id: '9', backgroundColor: '#9933ff' },
  { title: 'Strategy Session', id: '10', backgroundColor: '#ffcc33' },
  { title: 'Brainstorming', id: '11', backgroundColor: '#33ffcc' },
  { title: 'Sales Call', id: '12', backgroundColor: '#ff3333' },
  { title: 'Project Kickoff', id: '13', backgroundColor: '#33cc33' },
  { title: 'Design Review', id: '14', backgroundColor: '#ff6699' },
  { title: 'Town Hall', id: '15', backgroundColor: '#6699ff' },
  { title: 'Training Session', id: '16', backgroundColor: '#ff9933' },
  { title: 'Focus Group', id: '17', backgroundColor: '#33ff57' },
  { title: 'Advisory Board', id: '18', backgroundColor: '#ff33cc' },
  { title: 'Press Conference', id: '19', backgroundColor: '#33ccff' },
  { title: 'All Hands Meeting', id: '20', backgroundColor: '#ffcc33' },
]);

  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)
  const [newEvent, setNewEvent] = useState<Event>({
    title: '',
    start: '',
    allDay: false,
    id: 0,
    backgroundColor: '', // Ensure default background color is set or handled properly
  })

  useEffect(() => {
    let draggableEl = document.getElementById('draggable-el')
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title")
          let id = eventEl.getAttribute("data")
          let start = eventEl.getAttribute("start")
          let backgroundColor = eventEl.style.backgroundColor; // Capture background color
         
         
          return { title, id, start,backgroundColor }
        }
      })
     
    }
  }, [])

  
  function handleDateClick(arg: { date: Date, allDay: boolean }) {
    setNewEvent({ ...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime() })
    setShowModal(true)
  }

  function addEvent(data: DropArg) {
    const event = { ...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime(),backgroundColor:data.draggedEl.style.backgroundColor }
    setAllEvents([...allEvents, event])
    setEvents(prevEvents => {
  return prevEvents.filter(ev => {
    return ev.title !== event.title;
  });
    });
   
}
 

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true)
    setIdToDelete(Number(data.event.id))
  }

  // function handleDelete() {
  //   setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)))
  //   setShowDeleteModal(false)
  //   setIdToDelete(null)
  // }

  function handleDelete() {
  const eventToDelete = allEvents.find(event => Number(event.id) === Number(idToDelete));

  if (eventToDelete) {
    // Remove the event from allEvents
    setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)));
    
    // Add the event's title back to the draggable events list
    setEvents([
      ...events,
      { title: eventToDelete.title, id: eventToDelete.id.toString(), backgroundColor: eventToDelete.backgroundColor }
    ]);
  }

  // Close the delete modal and reset idToDelete
  setShowDeleteModal(false);
  setIdToDelete(null);
}

  function handleCloseModal() {
    setShowModal(false)
    setNewEvent({
      title: '',
      start: '',
      allDay: false,
      id: 0,
      backgroundColor: '', // Reset background color state
    })
    setShowDeleteModal(false)
    setIdToDelete(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAllEvents([...allEvents, newEvent])
    setShowModal(false)
    setNewEvent({
      title: '',
      start: '',
      allDay: false,
      id: 0,
       backgroundColor: '', // Reset background color state
    })
  }

  return (
    <>
   
      <main className="p-5 h-full w-full">
        <div className="flex flex-col gap-5">
          <div className=''>
             <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
               
              ]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                // right: 'resourceTimelineWeek, dayGridMonth,timeGridWeek'
                //right: 'dayGridMonth,timeGridWeek,listWeek'
                right: ''
              }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              drop={(data) => addEvent(data)}
              eventTextColor='#000'
              eventClick={(data) => handleDeleteModal(data)}
              height="700px"
              
              />
          </div>
          <div id="draggable-el" className="w-full bg-slate-200 p-4">
                 <h1 className="font-bold text-lg text-center mb-4">Available Task</h1>
                
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                    {events.map(event => (
                       <div
                       className="fc-event flex items-center justify-center border-2 p-1 w-full h-8 rounded-2xl text-center"
                        title={event.title}
                        key={event.id}
                        style={{ backgroundColor: event.backgroundColor, cursor: 'pointer', color: '#000' }}
                          >
                      {event.title}
                         </div>
                   ))}
                 </div>
            </div>

   
        

         </div>

        <Transition.Root show={showDeleteModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowDeleteModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"

            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg
                   bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                      justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Delete Event
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this event?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                      font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={handleDelete}>
                        Delete
                      </button>
                      <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                      shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <Transition.Root show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          Add Event
                        </Dialog.Title>
                        <form action="submit" onSubmit={handleSubmit}>
                          <div className="mt-2">
                            <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                            focus:ring-2 
                            focus:ring-inset focus:ring-violet-600 
                            sm:text-sm sm:leading-6"
                              value={newEvent.title} onChange={(e) => handleChange(e)} placeholder="Title" />
                          </div>
                          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
                              disabled={newEvent.title === ''}
                            >
                              Create
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                              onClick={handleCloseModal}

                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </main >
    </>
  )
}
