export const originalDummyOrders = [
    {
      id: "1",
      service: "Food",
      status: "Pending",
      priority: "high",
      total: 500,
      date: "2024-01-24T10:30:00",
      customer: {
        name: "John Doe",
        room: "301",
        phone: "+1234567890",
      },
      items: [
        { name: "Butter Chicken", quantity: 1, price: 300 },
        { name: "Naan", quantity: 2, price: 100 },
        { name: "Gulab Jamun", quantity: 2, price: 100 },
      ],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T10:30:00",
          note: "Order received",
        },
      ],
      notes: [
        {
          text: "Customer requested extra spicy",
          timestamp: "2024-01-24T10:31:00",
          author: "Staff",
        },
      ],
    },
    {
      id: "2",
      service: "Laundry",
      status: "In Progress",
      priority: "medium",
      total: 300,
      date: "2024-01-24T09:15:00",
      customer: {
        name: "Jane Smith",
        room: "405",
        phone: "+1234567891",
      },
      items: [{ name: "Wash & Iron", quantity: 3, price: 100 }],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T09:15:00",
          note: "Order received",
        },
        {
          status: "In Progress",
          timestamp: "2024-01-24T09:30:00",
          note: "Processing started",
        },
      ],
      notes: [],
    },
    {
      id: "3",
      service: "Room Service",
      status: "Completed",
      priority: "low",
      total: 750,
      date: "2024-01-24T11:45:00",
      customer: {
        name: "Alice Johnson",
        room: "502",
        phone: "+1234567892",
      },
      items: [
        { name: "Club Sandwich", quantity: 2, price: 250 },
        { name: "Caesar Salad", quantity: 1, price: 150 },
        { name: "Fruit Platter", quantity: 1, price: 100 },
      ],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T11:45:00",
          note: "Order received",
        },
        {
          status: "In Progress",
          timestamp: "2024-01-24T11:50:00",
          note: "Preparing food",
        },
        {
          status: "Completed",
          timestamp: "2024-01-24T12:15:00",
          note: "Delivered to room",
        },
      ],
      notes: [
        {
          text: "Customer allergic to nuts",
          timestamp: "2024-01-24T11:46:00",
          author: "Kitchen Staff",
        },
      ],
    },
    {
      id: "4",
      service: "Housekeeping",
      status: "Pending",
      priority: "high",
      total: 250,
      date: "2024-01-24T13:00:00",
      customer: {
        name: "Bob Williams",
        room: "203",
        phone: "+1234567893",
      },
      items: [{ name: "Room Cleaning", quantity: 1, price: 250 }],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T13:00:00",
          note: "Request received",
        },
      ],
      notes: [
        {
          text: "VIP guest, ensure thorough cleaning",
          timestamp: "2024-01-24T13:01:00",
          author: "Front Desk",
        },
      ],
    },
    {
      id: "5",
      service: "Spa",
      status: "In Progress",
      priority: "medium",
      total: 1200,
      date: "2024-01-24T14:30:00",
      customer: {
        name: "Carol Davis",
        room: "601",
        phone: "+1234567894",
      },
      items: [
        { name: "Full Body Massage", quantity: 1, price: 800 },
        { name: "Facial Treatment", quantity: 1, price: 400 },
      ],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T14:30:00",
          note: "Appointment booked",
        },
        {
          status: "In Progress",
          timestamp: "2024-01-24T15:00:00",
          note: "Treatment started",
        },
      ],
      notes: [],
    },
    {
      id: "6",
      service: "Concierge",
      status: "Completed",
      priority: "low",
      total: 150,
      date: "2024-01-24T16:00:00",
      customer: {
        name: "David Brown",
        room: "402",
        phone: "+1234567895",
      },
      items: [
        { name: "Theater Ticket Booking", quantity: 2, price: 75 },
      ],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T16:00:00",
          note: "Request received",
        },
        {
          status: "In Progress",
          timestamp: "2024-01-24T16:15:00",
          note: "Booking tickets",
        },
        {
          status: "Completed",
          timestamp: "2024-01-24T16:30:00",
          note: "Tickets booked and delivered",
        },
      ],
      notes: [
        {
          text: "Guest prefers orchestra seats",
          timestamp: "2024-01-24T16:05:00",
          author: "Concierge",
        },
      ],
    },
    {
      id: "7",
      service: "Food",
      status: "In Progress",
      priority: "high",
      total: 850,
      date: "2024-01-24T18:45:00",
      customer: {
        name: "Emma Wilson",
        room: "701",
        phone: "+1234567896",
      },
      items: [
        { name: "Grilled Salmon", quantity: 2, price: 300 },
        { name: "Vegetable Risotto", quantity: 1, price: 150 },
        { name: "Chocolate Mousse", quantity: 2, price: 100 },
      ],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T18:45:00",
          note: "Order received",
        },
        {
          status: "In Progress",
          timestamp: "2024-01-24T18:50:00",
          note: "Preparing food",
        },
      ],
      notes: [
        {
          text: "One guest is vegetarian",
          timestamp: "2024-01-24T18:46:00",
          author: "Room Service",
        },
      ],
    },
    {
      id: "8",
      service: "Maintenance",
      status: "Pending",
      priority: "high",
      total: 1540,
      date: "2024-01-24T20:00:00",
      customer: {
        name: "Frank Miller",
        room: "305",
        phone: "+1234567897",
      },
      items: [{ name: "AC Repair", quantity: 1, price: 1540 }],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T20:00:00",
          note: "Complaint received",
        },
      ],
      notes: [
        {
          text: "Guest reported AC not cooling properly",
          timestamp: "2024-01-24T20:01:00",
          author: "Front Desk",
        },
      ],
    },
    {
      id: "9",
      service: "Laundry",
      status: "Completed",
      priority: "medium",
      total: 450,
      date: "2024-01-24T08:30:00",
      customer: {
        name: "Grace Taylor",
        room: "506",
        phone: "+1234567898",
      },
      items: [
        { name: "Wash & Fold", quantity: 2, price: 150 },
        { name: "Dry Cleaning", quantity: 1, price: 150 },
      ],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T08:30:00",
          note: "Order received",
        },
        {
          status: "In Progress",
          timestamp: "2024-01-24T09:00:00",
          note: "Processing laundry",
        },
        {
          status: "Completed",
          timestamp: "2024-01-24T11:30:00",
          note: "Laundry delivered to room",
        },
      ],
      notes: [],
    },
    {
      id: "10",
      service: "Room Service",
      status: "In Progress",
      priority: "medium",
      total: 350,
      date: "2024-01-24T21:15:00",
      customer: {
        name: "Henry Clark",
        room: "604",
        phone: "+1234567899",
      },
      items: [
        { name: "Margherita Pizza", quantity: 1, price: 200 },
        { name: "Caesar Salad", quantity: 1, price: 100 },
        { name: "Tiramisu", quantity: 1, price: 50 },
      ],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T21:15:00",
          note: "Order received",
        },
        {
          status: "In Progress",
          timestamp: "2024-01-24T21:20:00",
          note: "Preparing food",
        },
      ],
      notes: [
        {
          text: "Guest requested extra cheese on pizza",
          timestamp: "2024-01-24T21:16:00",
          author: "Kitchen Staff",
        },
      ],
    },
    {
      id: "11",
      service: "Housekeeping",
      status: "Completed",
      priority: "low",
      total: 50,
      date: "2024-01-24T10:00:00",
      customer: {
        name: "Isabel Martinez",
        room: "401",
        phone: "+1234567900",
      },
      items: [{ name: "Extra Towels", quantity: 2, price: 25 }],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T10:00:00",
          note: "Request received",
        },
        {
          status: "In Progress",
          timestamp: "2024-01-24T10:05:00",
          note: "Preparing items",
        },
        {
          status: "Completed",
          timestamp: "2024-01-24T10:15:00",
          note: "Items delivered to room",
        },
      ],
      notes: [],
    },
    {
      id: "12",
      service: "Concierge",
      status: "Pending",
      priority: "high",
      total: 10000,
      date: "2024-01-24T22:30:00",
      customer: {
        name: "Jack Robinson",
        room: "801",
        phone: "+1234567901",
      },
      items: [
        { name: "Airport Transfer Booking", quantity: 1, price: 10000 },
      ],
      statusHistory: [
        {
          status: "Pending",
          timestamp: "2024-01-24T22:30:00",
          note: "Request received",
        },
      ],
      notes: [
        {
          text: "Guest needs early morning pickup at 5:00 AM",
          timestamp: "2024-01-24T22:31:00",
          author: "Night Concierge",
        },
      ],
    },
  ];