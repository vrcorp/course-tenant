// Dummy data for the SaaS Video Hosting + LMS application

export const programs = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    description: "Master modern web development from frontend to backend",
    thumbnail: "https://placehold.co/400x300/2563eb/ffffff?text=Web+Dev",
    price: 299,
    type: "subscription",
    duration: "12 weeks",
    students: 1245,
    rating: 4.8,
    instructor: "John Smith",
    courses: [
      {
        id: 1,
        title: "HTML & CSS Fundamentals",
        modules: [
          {
            id: 1,
            title: "Getting Started with HTML",
            lessons: [
              {
                id: 1,
                title: "Introduction to HTML",
                videoUrl: "https://sample-videos.com/zip/10/mp4/720p_dummy.mp4",
                duration: 15,
                completed: true,
                materials: "HTML tags, structure, semantic elements"
              },
              {
                id: 2,
                title: "HTML Forms and Inputs",
                videoUrl: "https://sample-videos.com/zip/10/mp4/720p_dummy.mp4",
                duration: 20,
                completed: false,
                materials: "Form elements, validation, accessibility"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    description: "Learn proven digital marketing strategies",
    thumbnail: "https://placehold.co/400x300/059669/ffffff?text=Marketing",
    price: 199,
    type: "ppv",
    duration: "8 weeks",
    students: 856,
    rating: 4.6,
    instructor: "Sarah Johnson",
    courses: []
  },
  {
    id: 3,
    title: "Data Science with Python",
    description: "Complete data science curriculum with hands-on projects",
    thumbnail: "https://placehold.co/400x300/7c3aed/ffffff?text=Data+Science",
    price: 399,
    type: "rental",
    duration: "16 weeks",
    students: 567,
    rating: 4.9,
    instructor: "Dr. Michael Chen",
    courses: []
  }
];

export const videos = [
  {
    id: 1,
    title: "React Hooks Deep Dive",
    filename: "react-hooks-deepdive.mp4",
    size: "256 MB",
    duration: "45:30",
    uploadDate: "2024-01-15",
    status: "completed",
    transcodingProgress: 100,
    thumbnail: "https://placehold.co/320x180/2563eb/ffffff?text=React+Video",
    views: 2340,
    playbackToken: "token_abc123xyz"
  },
  {
    id: 2,
    title: "Node.js Authentication",
    filename: "nodejs-auth-tutorial.mp4",
    size: "189 MB",
    duration: "32:15",
    uploadDate: "2024-01-14",
    status: "transcoding",
    transcodingProgress: 65,
    thumbnail: "https://placehold.co/320x180/059669/ffffff?text=Node.js+Auth",
    views: 1876,
    playbackToken: "token_def456uvw"
  },
  {
    id: 3,
    title: "CSS Grid Layout Mastery",
    filename: "css-grid-tutorial.mp4",
    size: "342 MB",
    duration: "58:42",
    uploadDate: "2024-01-13",
    status: "failed",
    transcodingProgress: 0,
    thumbnail: "https://placehold.co/320x180/dc2626/ffffff?text=CSS+Grid",
    views: 0,
    playbackToken: null
  },
  {
    id: 4,
    title: "JavaScript ES6+ Features",
    filename: "js-es6-features.mp4",
    size: "298 MB",
    duration: "51:22",
    uploadDate: "2024-01-12",
    status: "completed",
    transcodingProgress: 100,
    thumbnail: "https://placehold.co/320x180/f59e0b/ffffff?text=JavaScript",
    views: 3421,
    playbackToken: "token_ghi789rst"
  }
];

export const quizzes = [
  {
    id: 1,
    title: "HTML Fundamentals Quiz",
    lessonId: 1,
    questions: [
      {
        id: 1,
        type: "mcq",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Markup Language"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        type: "essay",
        question: "Explain the importance of semantic HTML elements in web development.",
        correctAnswer: "Semantic HTML elements provide meaning to the content, improve accessibility, and help search engines understand the page structure."
      }
    ],
    passingScore: 70,
    timeLimit: 30
  }
];

export const assignments = [
  {
    id: 1,
    title: "Build a Personal Portfolio Website",
    lessonId: 1,
    description: "Create a responsive portfolio website using HTML and CSS",
    dueDate: "2024-02-15",
    submissions: [
      {
        id: 1,
        studentName: "Alice Cooper",
        submittedAt: "2024-01-20",
        fileUrl: "portfolio-alice.zip",
        status: "graded",
        score: 85,
        feedback: "Great work! The design is clean and responsive. Consider adding more interactive elements."
      }
    ]
  }
];

export const certificates = [
  {
    id: 1,
    studentName: "John Doe",
    courseName: "HTML & CSS Fundamentals",
    completionDate: "2024-01-20",
    serialNumber: "CERT-2024-HTML-001",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CERT-2024-HTML-001"
  }
];

export const liveClasses = [
  {
    id: 1,
    title: "Live Q&A: Advanced React Patterns",
    instructor: "John Smith",
    scheduledAt: "2024-02-01T15:00:00Z",
    duration: 60,
    meetingUrl: "https://meet.example.com/react-qa",
    maxParticipants: 50,
    registeredCount: 32,
    status: "upcoming"
  },
  {
    id: 2,
    title: "Workshop: Building REST APIs",
    instructor: "Sarah Johnson",
    scheduledAt: "2024-01-25T14:00:00Z",
    duration: 90,
    meetingUrl: "https://meet.example.com/api-workshop",
    maxParticipants: 30,
    registeredCount: 28,
    status: "completed"
  }
];

export const forumThreads = [
  {
    id: 1,
    lessonId: 1,
    title: "Question about HTML semantic elements",
    author: "student123",
    createdAt: "2024-01-20T10:30:00Z",
    replies: 5,
    lastActivity: "2024-01-21T09:15:00Z",
    content: "I'm confused about when to use <article> vs <section>. Can someone explain?"
  },
  {
    id: 2,
    lessonId: 1,
    title: "Sharing my portfolio project",
    author: "webdev_newbie",
    createdAt: "2024-01-19T16:45:00Z",
    replies: 12,
    lastActivity: "2024-01-21T11:20:00Z",
    content: "Just finished my first portfolio website! Would love to get feedback from everyone."
  }
];

export const products = [
  {
    id: 1,
    name: "Web Development Bootcamp - Full Access",
    type: "subscription",
    price: 299,
    billingPeriod: "monthly",
    description: "Complete access to all web development courses",
    features: ["All video content", "Live Q&A sessions", "Certificate upon completion", "Discord community access"]
  },
  {
    id: 2,
    name: "Single Course - React Mastery",
    type: "ppv",
    price: 99,
    description: "One-time purchase for React course",
    features: ["Lifetime access", "Source code included", "Email support"]
  },
  {
    id: 3,
    name: "Premium Course Rental - 30 Days",
    type: "rental",
    price: 49,
    rentalPeriod: 30,
    description: "30-day access to premium course content",
    features: ["30-day access", "HD video streaming", "Downloadable resources"]
  }
];

export const orders = [
  {
    id: "ORD-2024-001",
    customerName: "John Smith",
    email: "john@example.com",
    productName: "Web Development Bootcamp",
    amount: 299,
    status: "completed",
    paymentMethod: "Credit Card",
    orderDate: "2024-01-20T14:30:00Z",
    invoiceUrl: "/invoices/ORD-2024-001.pdf"
  },
  {
    id: "ORD-2024-002",
    customerName: "Sarah Johnson",
    email: "sarah@example.com",
    productName: "React Mastery Course",
    amount: 99,
    status: "pending",
    paymentMethod: "PayPal",
    orderDate: "2024-01-21T09:15:00Z",
    invoiceUrl: null
  }
];

export const notifications = [
  {
    id: 1,
    type: "payment_success",
    title: "Payment Received",
    message: "Payment of $299 received for Web Development Bootcamp",
    channel: "email",
    sentAt: "2024-01-20T14:32:00Z",
    status: "delivered"
  },
  {
    id: 2,
    type: "video_upload",
    title: "Video Processing Complete",
    message: "Your video 'React Hooks Deep Dive' has been processed successfully",
    channel: "webhook",
    sentAt: "2024-01-20T12:15:00Z",
    status: "delivered"
  }
];

export const webhookEvents = [
  {
    id: 1,
    event: "video.upload.completed",
    url: "https://api.example.com/webhooks/video-upload",
    lastTriggered: "2024-01-20T12:15:00Z",
    status: "active",
    retryCount: 0
  },
  {
    id: 2,
    event: "payment.succeeded",
    url: "https://api.example.com/webhooks/payment",
    lastTriggered: "2024-01-20T14:32:00Z",
    status: "active",
    retryCount: 0
  },
  {
    id: 3,
    event: "course.completed",
    url: "https://api.example.com/webhooks/course-completion",
    lastTriggered: "2024-01-19T16:45:00Z",
    status: "failed",
    retryCount: 3
  }
];

export const dashboardStats = {
  storage: {
    used: 2.4,
    total: 10,
    unit: "TB"
  },
  bandwidth: {
    used: 156,
    total: 500,
    unit: "GB"
  },
  revenue: {
    thisMonth: 45680,
    lastMonth: 38950,
    growth: 17.3
  },
  videos: {
    total: 1247,
    thisMonth: 89,
    processing: 12
  },
  students: {
    total: 8934,
    active: 2341,
    newThisMonth: 423
  }
};

export const analyticsData = {
  videoRetention: [
    { time: 0, percentage: 100 },
    { time: 10, percentage: 87 },
    { time: 20, percentage: 76 },
    { time: 30, percentage: 68 },
    { time: 40, percentage: 62 },
    { time: 50, percentage: 45 },
    { time: 60, percentage: 32 }
  ],
  courseProgress: [
    { course: "Web Dev", completed: 78, inProgress: 145, notStarted: 67 },
    { course: "Marketing", completed: 56, inProgress: 89, notStarted: 34 },
    { course: "Data Science", completed: 34, inProgress: 67, notStarted: 123 }
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 38950 },
    { month: "Feb", revenue: 45680 },
    { month: "Mar", revenue: 52340 },
    { month: "Apr", revenue: 48920 },
    { month: "May", revenue: 56780 },
    { month: "Jun", revenue: 61230 }
  ]
};

export const tenants = [
  {
    id: 1,
    name: "TechEdu Platform",
    domain: "techedu.example.com",
    owner: "John Smith",
    email: "john@techedu.com",
    plan: "Pro",
    storageLimit: 10, // TB
    bandwidthLimit: 500, // GB
    storageUsed: 2.4,
    bandwidthUsed: 156,
    status: "active",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Creative Learning Hub",
    domain: "creative.example.com",
    owner: "Sarah Johnson",
    email: "sarah@creative.com",
    plan: "Enterprise",
    storageLimit: 50,
    bandwidthLimit: 2000,
    storageUsed: 8.7,
    bandwidthUsed: 342,
    status: "active",
    createdAt: "2023-11-15T00:00:00Z"
  },
  {
    id: 3,
    name: "Startup Academy",
    domain: "startup.example.com",
    owner: "Mike Wilson",
    email: "mike@startup.com",
    plan: "Basic",
    storageLimit: 1,
    bandwidthLimit: 100,
    storageUsed: 0.8,
    bandwidthUsed: 67,
    status: "suspended",
    createdAt: "2024-01-10T00:00:00Z"
  }
];

export const apiKeys = [
  {
    id: 1,
    name: "Production API",
    key: "vhub_live_sk_1234567890abcdef",
    lastUsed: "2024-01-21T14:30:00Z",
    status: "active",
    permissions: ["video.upload", "video.stream", "analytics.read"]
  },
  {
    id: 2,
    name: "Development API",
    key: "vhub_test_sk_abcdef1234567890",
    lastUsed: "2024-01-20T09:15:00Z",
    status: "active",
    permissions: ["video.upload", "video.stream"]
  },
  {
    id: 3,
    name: "Legacy Integration",
    key: "vhub_live_sk_fedcba0987654321",
    lastUsed: "2024-01-18T16:45:00Z",
    status: "revoked",
    permissions: ["video.stream"]
  }
];

export const auditLogs = [
  {
    id: 1,
    action: "video.upload",
    user: "john@example.com",
    resource: "react-hooks-deepdive.mp4",
    timestamp: "2024-01-21T14:30:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: 2,
    action: "payment.process",
    user: "sarah@example.com",
    resource: "ORD-2024-002",
    timestamp: "2024-01-21T09:15:00Z",
    ipAddress: "10.0.0.45",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: 3,
    action: "api.access",
    user: "system",
    resource: "video.stream",
    timestamp: "2024-01-21T08:22:00Z",
    ipAddress: "203.0.113.42",
    userAgent: "API Client v1.0",
    status: "failed"
  }
];