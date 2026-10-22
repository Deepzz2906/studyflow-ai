import {
  StudentProfile,
  Subject,
  Assignment,
  Homework,
  TestExam,
  SubjectSyllabus,
  TimetableEvent,
  StudySessionLog,
  Note,
  GamificationBadge,
  AppNotification,
  DailyGoal
} from '../types';

export const INITIAL_STUDENT: StudentProfile = {
  id: 'student-alex-01',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  college: 'State University of Technology',
  course: 'B.S. Computer Science & Engineering',
  year: 3,
  semester: 5,
  targetGpa: 9.0,
  currentGpa: 8.5,
  availableDailyStudyMinutes: 180, // 3 hours
  preferredStudyTime: 'evening',
  sessionDurationPreference: 45,
  onboardingCompleted: true,
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-ds',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    color: '#4F46E5', // Indigo
    textColor: '#EEF2FF',
    instructor: 'Dr. Sarah Jenkins',
    credits: 4,
    confidenceScore: 4.1,
    syllabusProgress: 64,
    studyHoursLogged: 16.5,
    examDate: '2026-09-12',
    room: 'Hall B-204',
  },
  {
    id: 'sub-dbms',
    code: 'CS302',
    name: 'Database Management Systems',
    color: '#0EA5E9', // Sky Blue
    textColor: '#F0F9FF',
    instructor: 'Prof. Michael Torres',
    credits: 4,
    confidenceScore: 3.8,
    syllabusProgress: 72,
    studyHoursLogged: 14.0,
    examDate: '2026-09-18',
    room: 'Tech Lab 102',
  },
  {
    id: 'sub-os',
    code: 'CS303',
    name: 'Operating Systems',
    color: '#059669', // Emerald
    textColor: '#ECFDF5',
    instructor: 'Dr. Vikram Rao',
    credits: 4,
    confidenceScore: 3.4,
    syllabusProgress: 54,
    studyHoursLogged: 10.5,
    examDate: '2026-09-24',
    room: 'Science Block 301',
  },
  {
    id: 'sub-cn',
    code: 'CS304',
    name: 'Computer Networks',
    color: '#D97706', // Amber
    textColor: '#FFFBEB',
    instructor: 'Prof. Elena Rostova',
    credits: 3,
    confidenceScore: 3.2,
    syllabusProgress: 48,
    studyHoursLogged: 8.5,
    examDate: '2026-09-28',
    room: 'Hall A-110',
  },
  {
    id: 'sub-ai',
    code: 'CS305',
    name: 'Artificial Intelligence & ML',
    color: '#7C3AED', // Violet
    textColor: '#F5F3FF',
    instructor: 'Dr. Alan Harper',
    credits: 3,
    confidenceScore: 4.5,
    syllabusProgress: 80,
    studyHoursLogged: 19.0,
    examDate: '2026-10-04',
    room: 'AI Research Lab 4',
  },
];

// Reference date is assumed to be current semester date (e.g., 2026-09-08)
export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    title: 'B+ Tree & Indexing Implementation and Benchmark',
    subjectId: 'sub-dbms',
    description: 'Implement an in-memory B+ Tree with node splitting, merging, and range queries. Include benchmark report against AVL Tree.',
    teacher: 'Prof. Michael Torres',
    dueDate: '2026-09-09', // Tomorrow
    dueTime: '23:59',
    estimatedDurationMinutes: 150, // 2h 30m
    difficulty: 'Medium',
    priority: 'CRITICAL',
    calculatedPriorityScore: 95,
    status: 'In Progress',
    submissionLink: 'https://classroom.google.com/c/dbms-asg-3',
    notes: 'Make sure to run benchmark test suite on 100,000 keys.',
    createdAt: '2026-09-02',
    subtasks: [
      { id: 'st-1', title: 'Review B+ Tree insertion & split algorithm', estimatedMinutes: 25, isCompleted: true, order: 1 },
      { id: 'st-2', title: 'Implement Node struct & split child function', estimatedMinutes: 40, isCompleted: true, order: 2 },
      { id: 'st-3', title: 'Implement range search iterator', estimatedMinutes: 30, isCompleted: true, order: 3 },
      { id: 'st-4', title: 'Write unit tests for edge cases', estimatedMinutes: 25, isCompleted: false, order: 4 },
      { id: 'st-5', title: 'Generate benchmark graphs & write 2-page PDF report', estimatedMinutes: 30, isCompleted: false, order: 5 },
    ],
  },
  {
    id: 'asg-02',
    title: 'Multi-threaded TCP Chat Server & Client with Select()',
    subjectId: 'sub-cn',
    description: 'Design a concurrent socket server in C/C++ handling multiplexed I/O using epoll or select(), with room broadcasting and heartbeat.',
    teacher: 'Prof. Elena Rostova',
    dueDate: '2026-09-13',
    dueTime: '18:00',
    estimatedDurationMinutes: 240, // 4 hours
    difficulty: 'Hard',
    priority: 'HIGH',
    calculatedPriorityScore: 82,
    status: 'Not Started',
    createdAt: '2026-09-05',
    subtasks: [
      { id: 'st-201', title: 'Socket initialization & bind/listen logic', estimatedMinutes: 30, isCompleted: false, order: 1 },
      { id: 'st-202', title: 'Non-blocking I/O & fd_set polling', estimatedMinutes: 60, isCompleted: false, order: 2 },
      { id: 'st-203', title: 'Message protocol framing & user registry', estimatedMinutes: 50, isCompleted: false, order: 3 },
      { id: 'st-204', title: 'Concurrency test with 50 automated clients', estimatedMinutes: 40, isCompleted: false, order: 4 },
      { id: 'st-205', title: 'Documentation & Wireshark packet capture trace', estimatedMinutes: 60, isCompleted: false, order: 5 },
    ],
  },
  {
    id: 'asg-03',
    title: 'Round Robin & Priority CPU Scheduler Simulator',
    subjectId: 'sub-os',
    description: 'Simulate CPU scheduling algorithms measuring average turnaround time, waiting time, and CPU utilization under varying quantum lengths.',
    teacher: 'Dr. Vikram Rao',
    dueDate: '2026-09-16',
    dueTime: '23:59',
    estimatedDurationMinutes: 180,
    difficulty: 'Medium',
    priority: 'MEDIUM',
    calculatedPriorityScore: 68,
    status: 'Not Started',
    createdAt: '2026-09-06',
    subtasks: [
      { id: 'st-301', title: 'Define Process PCB data structure & Ready Queue', estimatedMinutes: 25, isCompleted: false, order: 1 },
      { id: 'st-302', title: 'Simulate Preemptive Priority scheduling', estimatedMinutes: 45, isCompleted: false, order: 2 },
      { id: 'st-303', title: 'Simulate Round Robin with varying Quantum', estimatedMinutes: 45, isCompleted: false, order: 3 },
      { id: 'st-304', title: 'Plot Gantt charts & calculate metrics', estimatedMinutes: 35, isCompleted: false, order: 4 },
      { id: 'st-305', title: 'Code cleanup & submit archive', estimatedMinutes: 30, isCompleted: false, order: 5 },
    ],
  },
  {
    id: 'asg-04',
    title: 'A* Search Algorithm for 8-Puzzle Solver',
    subjectId: 'sub-ai',
    description: 'Implement Manhattan Distance and Misplaced Tiles heuristics in Python to solve 15 random initial configurations.',
    teacher: 'Dr. Alan Harper',
    dueDate: '2026-09-20',
    dueTime: '23:59',
    estimatedDurationMinutes: 120,
    difficulty: 'Easy',
    priority: 'LOW',
    calculatedPriorityScore: 45,
    status: 'Not Started',
    createdAt: '2026-09-07',
    subtasks: [
      { id: 'st-401', title: 'Heuristic evaluation functions', estimatedMinutes: 30, isCompleted: false, order: 1 },
      { id: 'st-402', title: 'Priority queue state exploration', estimatedMinutes: 45, isCompleted: false, order: 2 },
      { id: 'st-403', title: 'Compare expanded nodes and runtime', estimatedMinutes: 45, isCompleted: false, order: 3 },
    ],
  },
];

export const INITIAL_HOMEWORK: Homework[] = [
  {
    id: 'hw-01',
    title: 'SQL Complex Joins & Subqueries Practice Sheet (Q1-Q15)',
    subjectId: 'sub-dbms',
    dueDate: '2026-09-09', // Tomorrow
    dueTime: '17:00',
    estimatedMinutes: 40,
    priority: 'HIGH',
    status: 'In Progress',
    notes: 'Focus on correlated subqueries and CTE expressions.',
    createdAt: '2026-09-07',
  },
  {
    id: 'hw-02',
    title: 'AVL Tree Double Rotation Hand-Trace Exercise',
    subjectId: 'sub-ds',
    dueDate: '2026-09-10',
    dueTime: '09:00',
    estimatedMinutes: 30,
    priority: 'HIGH',
    status: 'Not Started',
    notes: 'Prepare drawings for RL and LR rotation balance factors.',
    createdAt: '2026-09-07',
  },
  {
    id: 'hw-03',
    title: 'IPv4 CIDR Subnetting & Supernetting Calculations (Set B)',
    subjectId: 'sub-cn',
    dueDate: '2026-09-11',
    dueTime: '14:00',
    estimatedMinutes: 45,
    priority: 'MEDIUM',
    status: 'Not Started',
    notes: '12 subnet allocation scenarios for campus LAN.',
    createdAt: '2026-09-06',
  },
];

export const INITIAL_TESTS: TestExam[] = [
  {
    id: 'test-ds-cat1',
    name: 'Data Structures CAT 1 (Continuous Assessment)',
    subjectId: 'sub-ds',
    testType: 'CAT 1',
    date: '2026-09-12', // 4 days from now
    time: '10:00',
    durationMinutes: 90,
    totalMarks: 50,
    difficulty: 'Hard',
    preparationPercentage: 42,
    notes: 'Covers Units 1 & 2. Heavy emphasis on binary search trees, AVL rotations, and stack applications.',
    topics: [
      { id: 'tt-1', name: 'Arrays & Dynamic Sizing', unit: 'Unit 1', confidence: 'High', estimatedHours: 1.0, isRevised: true },
      { id: 'tt-2', name: 'Singly & Doubly Linked Lists', unit: 'Unit 1', confidence: 'High', estimatedHours: 1.5, isRevised: true },
      { id: 'tt-3', name: 'Stacks (Infix to Postfix & Evaluation)', unit: 'Unit 2', confidence: 'Medium', estimatedHours: 1.5, isRevised: false },
      { id: 'tt-4', name: 'Circular & Priority Queues', unit: 'Unit 2', confidence: 'Medium', estimatedHours: 1.5, isRevised: false },
      { id: 'tt-5', name: 'Binary Trees & Tree Traversals', unit: 'Unit 3', confidence: 'Low', estimatedHours: 2.5, isRevised: false },
      { id: 'tt-6', name: 'AVL Trees & Balance Factors', unit: 'Unit 3', confidence: 'Low', estimatedHours: 3.0, isRevised: false },
    ],
    generatedPrepPlan: [
      {
        dayNumber: 1,
        dayDate: '2026-09-08',
        sessions: [
          { topic: 'Stacks & Postfix Evaluation', durationMinutes: 40, activityType: 'Concept Review', isDone: true },
          { topic: 'Circular Queues Practice', durationMinutes: 30, activityType: 'Problem Solving', isDone: false },
        ],
      },
      {
        dayNumber: 2,
        dayDate: '2026-09-09',
        sessions: [
          { topic: 'Binary Search Trees Insert & Delete', durationMinutes: 45, activityType: 'Concept Review' },
          { topic: 'Tree Traversals (In, Pre, Post)', durationMinutes: 35, activityType: 'Problem Solving' },
        ],
      },
      {
        dayNumber: 3,
        dayDate: '2026-09-10',
        sessions: [
          { topic: 'AVL Trees & 4 Rotations', durationMinutes: 60, activityType: 'Concept Review' },
          { topic: 'Previous Year CAT 1 Questions', durationMinutes: 45, activityType: 'Practice Questions' },
        ],
      },
      {
        dayNumber: 4,
        dayDate: '2026-09-11',
        sessions: [
          { topic: 'Mock Test Paper (50 Marks)', durationMinutes: 60, activityType: 'Mock Test' },
          { topic: 'Weak Area Revision & Formula Cheatsheet', durationMinutes: 30, activityType: 'Quick Revision' },
        ],
      },
    ],
  },
  {
    id: 'test-dbms-quiz',
    name: 'DBMS Normalization & Relational Algebra Quiz',
    subjectId: 'sub-dbms',
    testType: 'Surprise Quiz',
    date: '2026-09-18',
    time: '14:30',
    durationMinutes: 45,
    totalMarks: 25,
    difficulty: 'Medium',
    preparationPercentage: 65,
    notes: '1NF, 2NF, 3NF, BCNF decomposition and lossless join property.',
    topics: [
      { id: 'tt-11', name: 'Functional Dependencies', unit: 'Unit 2', confidence: 'High', estimatedHours: 1.0, isRevised: true },
      { id: 'tt-12', name: '1NF, 2NF, 3NF Normal Forms', unit: 'Unit 2', confidence: 'High', estimatedHours: 1.5, isRevised: true },
      { id: 'tt-13', name: 'BCNF & Dependency Preservation', unit: 'Unit 2', confidence: 'Medium', estimatedHours: 2.0, isRevised: false },
    ],
  },
  {
    id: 'test-os-mid',
    name: 'Operating Systems Midterm Exam',
    subjectId: 'sub-os',
    testType: 'Midterm',
    date: '2026-09-24',
    time: '09:30',
    durationMinutes: 120,
    totalMarks: 75,
    difficulty: 'Hard',
    preparationPercentage: 28,
    notes: 'Processes, Threads, CPU Scheduling, Synchronization, Semaphores, Deadlocks.',
    topics: [
      { id: 'tt-21', name: 'Process Synchronization & Critical Section', unit: 'Unit 2', confidence: 'Low', estimatedHours: 3.0, isRevised: false },
      { id: 'tt-22', name: 'Banker’s Deadlock Avoidance Algorithm', unit: 'Unit 3', confidence: 'Medium', estimatedHours: 2.0, isRevised: false },
    ],
  },
];

export const INITIAL_SYLLABUS: SubjectSyllabus[] = [
  {
    subjectId: 'sub-ds',
    units: [
      {
        id: 'u1',
        unitNumber: 1,
        title: 'Linear Data Structures & Arrays',
        topics: [
          {
            id: 'top-101',
            name: 'Array ADT & Multi-dimensional Memory Mapping',
            status: 'Mastered',
            importance: 'Medium',
            subtopics: [
              { id: 'sub-1', name: 'Row-major vs Column-major formulas', completed: true },
              { id: 'sub-2', name: 'Dynamic array amortized resizing', completed: true },
            ],
          },
          {
            id: 'top-102',
            name: 'Singly & Doubly Linked Lists',
            status: 'Mastered',
            importance: 'High',
            subtopics: [
              { id: 'sub-3', name: 'Pointer manipulation for deletion', completed: true },
              { id: 'sub-4', name: 'Circular linked lists with tail pointer', completed: true },
            ],
          },
        ],
      },
      {
        id: 'u2',
        unitNumber: 2,
        title: 'Stacks, Queues & Recursion',
        topics: [
          {
            id: 'top-201',
            name: 'Stack Applications & Infix-Postfix Conversion',
            status: 'Revised',
            importance: 'High',
            subtopics: [
              { id: 'sub-5', name: 'Operator precedence parsing', completed: true },
              { id: 'sub-6', name: 'Postfix expression evaluation using stack', completed: true },
            ],
          },
          {
            id: 'top-202',
            name: 'Queues, Deques & Circular Buffers',
            status: 'Learning',
            importance: 'High',
            subtopics: [
              { id: 'sub-7', name: 'Modulo arithmetic for circular queue', completed: true },
              { id: 'sub-8', name: 'Priority Queue using Binary Heap array', completed: false },
            ],
          },
        ],
      },
      {
        id: 'u3',
        unitNumber: 3,
        title: 'Non-Linear Trees & Search Structures',
        topics: [
          {
            id: 'top-301',
            name: 'Binary Search Trees (BST)',
            status: 'Learning',
            importance: 'High',
            subtopics: [
              { id: 'sub-9', name: 'Recursive insertion and searching', completed: true },
              { id: 'sub-10', name: 'Node deletion with two children', completed: false },
            ],
          },
          {
            id: 'top-302',
            name: 'Self-Balancing AVL Trees',
            status: 'Not Started',
            importance: 'High',
            subtopics: [
              { id: 'sub-11', name: 'Balance factor calculation', completed: false },
              { id: 'sub-12', name: 'LL, RR, LR, RL Rotations', completed: false },
            ],
          },
          {
            id: 'top-303',
            name: 'Red-Black Trees & B-Trees',
            status: 'Not Started',
            importance: 'Medium',
            subtopics: [
              { id: 'sub-13', name: 'Coloring rules & rotation cases', completed: false },
              { id: 'sub-14', name: 'B-Tree order and search complexity', completed: false },
            ],
          },
        ],
      },
      {
        id: 'u4',
        unitNumber: 4,
        title: 'Graphs & Advanced Algorithms',
        topics: [
          {
            id: 'top-401',
            name: 'Graph Representations & Traversals (BFS / DFS)',
            status: 'Not Started',
            importance: 'High',
            subtopics: [
              { id: 'sub-15', name: 'Adjacency matrix vs list trade-offs', completed: false },
              { id: 'sub-16', name: 'Cycle detection in directed graphs', completed: false },
            ],
          },
          {
            id: 'top-402',
            name: 'Shortest Path (Dijkstra & Bellman-Ford)',
            status: 'Not Started',
            importance: 'High',
            subtopics: [
              { id: 'sub-17', name: 'Dijkstra greedy relaxation with min-heap', completed: false },
              { id: 'sub-18', name: 'Negative edge cycle detection', completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    subjectId: 'sub-dbms',
    units: [
      {
        id: 'db-u1',
        unitNumber: 1,
        title: 'Relational Model & SQL Fundamentals',
        topics: [
          {
            id: 'db-top-1',
            name: 'ER Modeling & Relational Mapping',
            status: 'Mastered',
            importance: 'High',
            subtopics: [
              { id: 'db-sub-1', name: 'Cardinality ratios and participation constraints', completed: true },
              { id: 'db-sub-2', name: 'Converting Weak Entities to Relational Tables', completed: true },
            ],
          },
          {
            id: 'db-top-2',
            name: 'Complex SQL Joins, CTEs & Window Functions',
            status: 'Revised',
            importance: 'High',
            subtopics: [
              { id: 'db-sub-3', name: 'Correlated subqueries vs Inner/Outer Joins', completed: true },
              { id: 'db-sub-4', name: 'ROW_NUMBER(), RANK(), DENSE_RANK()', completed: true },
            ],
          },
        ],
      },
      {
        id: 'db-u2',
        unitNumber: 2,
        title: 'Normalization & Schema Refinement',
        topics: [
          {
            id: 'db-top-3',
            name: 'Functional Dependencies & Armstrong Axioms',
            status: 'Mastered',
            importance: 'High',
            subtopics: [
              { id: 'db-sub-5', name: 'Attribute closure algorithm', completed: true },
              { id: 'db-sub-6', name: 'Minimal canonical cover', completed: true },
            ],
          },
          {
            id: 'db-top-4',
            name: '1NF, 2NF, 3NF & BCNF Decomposition',
            status: 'Learning',
            importance: 'High',
            subtopics: [
              { id: 'db-sub-7', name: 'Lossless join check using tableau method', completed: true },
              { id: 'db-sub-8', name: 'Dependency preservation vs BCNF trade-off', completed: false },
            ],
          },
        ],
      },
      {
        id: 'db-u3',
        unitNumber: 3,
        title: 'Transactions, Concurrency & Indexing',
        topics: [
          {
            id: 'db-top-5',
            name: 'ACID Properties & Serializability Schedules',
            status: 'Learning',
            importance: 'High',
            subtopics: [
              { id: 'db-sub-9', name: 'Conflict serializability & precedence graph', completed: false },
              { id: 'db-sub-10', name: 'Two-Phase Locking (2PL) protocols', completed: false },
            ],
          },
          {
            id: 'db-top-6',
            name: 'B+ Tree Indexing & Hash Indices',
            status: 'Revised',
            importance: 'High',
            subtopics: [
              { id: 'db-sub-11', name: 'Clustered vs Unclustered index design', completed: true },
              { id: 'db-sub-12', name: 'B+ Tree node split and balance algorithm', completed: true },
            ],
          },
        ],
      },
    ],
  },
  {
    subjectId: 'sub-os',
    units: [
      {
        id: 'os-u1',
        unitNumber: 1,
        title: 'Processes, Threads & CPU Scheduling',
        topics: [
          {
            id: 'os-top-1',
            name: 'Process State Transitions & PCB',
            status: 'Mastered',
            importance: 'Medium',
            subtopics: [{ id: 'os-s1', name: 'Context switching overhead', completed: true }],
          },
          {
            id: 'os-top-2',
            name: 'CPU Scheduling Algorithms',
            status: 'Revised',
            importance: 'High',
            subtopics: [{ id: 'os-s2', name: 'FCFS, SJF, Priority, Round Robin Gantt chart metrics', completed: true }],
          },
        ],
      },
      {
        id: 'os-u2',
        unitNumber: 2,
        title: 'Process Synchronization & Deadlocks',
        topics: [
          {
            id: 'os-top-3',
            name: 'Critical Section Problem & Semaphores',
            status: 'Learning',
            importance: 'High',
            subtopics: [{ id: 'os-s3', name: 'Peterson solution & Mutex / Counting semaphores', completed: false }],
          },
          {
            id: 'os-top-4',
            name: 'Classic Sync: Producer-Consumer & Readers-Writers',
            status: 'Learning',
            importance: 'High',
            subtopics: [{ id: 'os-s4', name: 'Condition variables and monitor implementations', completed: false }],
          },
        ],
      },
    ],
  },
  {
    subjectId: 'sub-cn',
    units: [
      {
        id: 'cn-u1',
        unitNumber: 1,
        title: 'Physical & Data Link Layers',
        topics: [
          {
            id: 'cn-top-1',
            name: 'OSI vs TCP/IP Reference Architectures',
            status: 'Mastered',
            importance: 'Medium',
            subtopics: [{ id: 'cn-s1', name: 'Layer encapsulation & headers', completed: true }],
          },
          {
            id: 'cn-top-2',
            name: 'Sliding Window & Error Control (CRC, HDLC)',
            status: 'Revised',
            importance: 'High',
            subtopics: [{ id: 'cn-s2', name: 'Go-Back-N vs Selective Repeat protocols', completed: true }],
          },
        ],
      },
      {
        id: 'cn-u2',
        unitNumber: 2,
        title: 'Network Layer & IP Addressing',
        topics: [
          {
            id: 'cn-top-3',
            name: 'IPv4 Addressing, Subnetting & CIDR',
            status: 'Learning',
            importance: 'High',
            subtopics: [{ id: 'cn-s3', name: 'Variable Length Subnet Masking (VLSM)', completed: false }],
          },
          {
            id: 'cn-top-4',
            name: 'Routing Algorithms (OSPF, BGP, Distance Vector)',
            status: 'Not Started',
            importance: 'High',
            subtopics: [{ id: 'cn-s4', name: 'Dijkstra link-state vs Bellman-Ford count-to-infinity', completed: false }],
          },
        ],
      },
    ],
  },
  {
    subjectId: 'sub-ai',
    units: [
      {
        id: 'ai-u1',
        unitNumber: 1,
        title: 'Intelligent Agents & Problem Solving Searches',
        topics: [
          {
            id: 'ai-top-1',
            name: 'Uninformed vs Informed Search (A* & IDA*)',
            status: 'Mastered',
            importance: 'High',
            subtopics: [{ id: 'ai-s1', name: 'Admissibility and consistency of heuristics', completed: true }],
          },
          {
            id: 'ai-top-2',
            name: 'Adversarial Search & Alpha-Beta Pruning',
            status: 'Mastered',
            importance: 'High',
            subtopics: [{ id: 'ai-s2', name: 'Minimax decision tree optimization', completed: true }],
          },
        ],
      },
    ],
  },
];

export const INITIAL_TIMETABLE: TimetableEvent[] = [
  // Monday (0)
  { id: 'tt-mon-1', title: 'Data Structures Lecture', subjectId: 'sub-ds', type: 'class', dayOfWeek: 0, startTime: '09:00', endTime: '10:30', room: 'Hall B-204', isRecurring: true },
  { id: 'tt-mon-2', title: 'DBMS Lecture', subjectId: 'sub-dbms', type: 'class', dayOfWeek: 0, startTime: '11:00', endTime: '12:30', room: 'Tech Lab 102', isRecurring: true },
  { id: 'tt-mon-3', title: 'Operating Systems Class', subjectId: 'sub-os', type: 'class', dayOfWeek: 0, startTime: '14:00', endTime: '15:30', room: 'Science Block 301', isRecurring: true },
  { id: 'tt-mon-4', title: 'DBMS Lab & Query Tuning', subjectId: 'sub-dbms', type: 'lab', dayOfWeek: 0, startTime: '16:00', endTime: '17:30', room: 'Lab 4', isRecurring: true },

  // Tuesday (1)
  { id: 'tt-tue-1', title: 'Computer Networks Lecture', subjectId: 'sub-cn', type: 'class', dayOfWeek: 1, startTime: '09:30', endTime: '11:00', room: 'Hall A-110', isRecurring: true },
  { id: 'tt-tue-2', title: 'Artificial Intelligence Class', subjectId: 'sub-ai', type: 'class', dayOfWeek: 1, startTime: '11:30', endTime: '13:00', room: 'AI Lab 4', isRecurring: true },
  { id: 'tt-tue-3', title: 'Data Structures Algo Lab', subjectId: 'sub-ds', type: 'lab', dayOfWeek: 1, startTime: '14:30', endTime: '16:30', room: 'Software Center 2', isRecurring: true },

  // Wednesday (2)
  { id: 'tt-wed-1', title: 'Data Structures Lecture', subjectId: 'sub-ds', type: 'class', dayOfWeek: 2, startTime: '09:00', endTime: '10:30', room: 'Hall B-204', isRecurring: true },
  { id: 'tt-wed-2', title: 'DBMS Lecture', subjectId: 'sub-dbms', type: 'class', dayOfWeek: 2, startTime: '11:00', endTime: '12:30', room: 'Tech Lab 102', isRecurring: true },
  { id: 'tt-wed-3', title: 'Operating Systems Class', subjectId: 'sub-os', type: 'class', dayOfWeek: 2, startTime: '14:00', endTime: '15:30', room: 'Science Block 301', isRecurring: true },

  // Thursday (3)
  { id: 'tt-thu-1', title: 'Computer Networks Lecture', subjectId: 'sub-cn', type: 'class', dayOfWeek: 3, startTime: '09:30', endTime: '11:00', room: 'Hall A-110', isRecurring: true },
  { id: 'tt-thu-2', title: 'Artificial Intelligence Class', subjectId: 'sub-ai', type: 'class', dayOfWeek: 3, startTime: '11:30', endTime: '13:00', room: 'AI Lab 4', isRecurring: true },
  { id: 'tt-thu-3', title: 'Networks Packet Socket Lab', subjectId: 'sub-cn', type: 'lab', dayOfWeek: 3, startTime: '14:00', endTime: '16:00', room: 'Networking Lab 1', isRecurring: true },

  // Friday (4)
  { id: 'tt-fri-1', title: 'Data Structures Tutorial & Problem Solving', subjectId: 'sub-ds', type: 'class', dayOfWeek: 4, startTime: '09:00', endTime: '10:30', room: 'Hall B-204', isRecurring: true },
  { id: 'tt-fri-2', title: 'Operating Systems Kernel Lab', subjectId: 'sub-os', type: 'lab', dayOfWeek: 4, startTime: '11:00', endTime: '13:00', room: 'Unix Lab 3', isRecurring: true },
  { id: 'tt-fri-3', title: 'Weekly Capstone & Faculty Consultation', subjectId: 'sub-ai', type: 'personal', dayOfWeek: 4, startTime: '15:00', endTime: '16:30', room: 'Faculty Lounge', isRecurring: true },

  // Saturday (5) - Study / Free day
  { id: 'tt-sat-1', title: 'Self-Paced DS CAT 1 Revision Block', subjectId: 'sub-ds', type: 'study', dayOfWeek: 5, startTime: '10:00', endTime: '12:30', room: 'Library Quiet Zone', isRecurring: false },

  // Sunday (6)
  { id: 'tt-sun-1', title: 'Weekly AI Planning & Assignment Wrap-up', type: 'study', dayOfWeek: 6, startTime: '17:00', endTime: '18:30', room: 'Dorm Desk', isRecurring: true },
];

export const INITIAL_STUDY_LOGS: StudySessionLog[] = [
  {
    id: 'log-01',
    subjectId: 'sub-ds',
    topic: 'Stacks & Postfix Evaluation',
    plannedMinutes: 45,
    actualMinutes: 45,
    date: '2026-09-08',
    startTime: '18:30',
    endTime: '19:15',
    confidenceRating: 4,
    notes: 'Completed infix to postfix conversions with parenthesis handling.',
    status: 'completed',
  },
  {
    id: 'log-02',
    subjectId: 'sub-dbms',
    topic: 'B+ Tree Splitting & Insertion Logic',
    plannedMinutes: 60,
    actualMinutes: 55,
    date: '2026-09-07',
    startTime: '20:00',
    endTime: '20:55',
    confidenceRating: 4,
    notes: 'Understood leaf node chaining and parent pointer redistribution.',
    status: 'completed',
  },
  {
    id: 'log-03',
    subjectId: 'sub-ai',
    topic: 'A* Search Heuristic Optimality',
    plannedMinutes: 40,
    actualMinutes: 40,
    date: '2026-09-06',
    startTime: '19:00',
    endTime: '19:40',
    confidenceRating: 5,
    notes: 'Proved admissibility condition for Manhattan distance.',
    status: 'completed',
  },
  {
    id: 'log-04',
    subjectId: 'sub-os',
    topic: 'Round Robin Scheduling Simulator',
    plannedMinutes: 50,
    actualMinutes: 45,
    date: '2026-09-05',
    startTime: '17:30',
    endTime: '18:15',
    confidenceRating: 3,
    notes: 'Calculated average waiting time for 4 processes with quantum q=3.',
    status: 'completed',
  },
  {
    id: 'log-05',
    subjectId: 'sub-cn',
    topic: 'Subnetting & VLSM Design',
    plannedMinutes: 45,
    actualMinutes: 45,
    date: '2026-09-04',
    startTime: '20:15',
    endTime: '21:00',
    confidenceRating: 3,
    notes: 'Practiced borrowing bits for 6 department subnets.',
    status: 'completed',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-01',
    title: 'Data Structures: AVL Tree Rotation Cheatsheet',
    subjectId: 'sub-ds',
    topic: 'Self-Balancing AVL Trees',
    tags: ['Cheat Sheet', 'CAT 1 Prep', 'Rotations'],
    isPinned: true,
    isArchived: false,
    updatedAt: '2026-09-07T18:40:00Z',
    content: `## AVL Trees - Balance Factor & 4 Rotation Cases

A Binary Search Tree is balanced if for every node:
$$\\text{Balance Factor (BF)} = \\text{Height(Left Subtree)} - \\text{Height(Right Subtree)} \\in \\{-1, 0, +1\\}$$

### When BF becomes $+2$ or $-2$, 4 rotation cases occur:

1. **LL Case (Left-Left)**:
   - Inserted in left subtree of left child ($BF = +2$, child $BF = +1$).
   - **Fix**: Perform a Single Right Rotation on the unbalanced node.

2. **RR Case (Right-Right)**:
   - Inserted in right subtree of right child ($BF = -2$, child $BF = -1$).
   - **Fix**: Perform a Single Left Rotation on the unbalanced node.

3. **LR Case (Left-Right)**:
   - Inserted in right subtree of left child ($BF = +2$, child $BF = -1$).
   - **Fix**: Double Rotation: Left rotate on left child, then Right rotate on unbalanced parent.

4. **RL Case (Right-Left)**:
   - Inserted in left subtree of right child ($BF = -2$, child $BF = +1$).
   - **Fix**: Double Rotation: Right rotate on right child, then Left rotate on unbalanced parent.

### Key Time Complexities:
- Search: $\\mathcal{O}(\\log N)$
- Insertion: $\\mathcal{O}(\\log N)$ (at most 1 or 2 rotations)
- Deletion: $\\mathcal{O}(\\log N)$ (may require up to $\\mathcal{O}(\\log N)$ rotations up the tree)`,
    aiSummary: 'Summary of AVL balance factor invariant (BF ∈ {-1,0,+1}), the 4 canonical rotation cases (LL, RR, LR, RL), and O(log N) runtime guarantees for upcoming CAT 1 exam.',
    flashcards: [
      { id: 'fc-1', question: 'What is the balance factor condition for an AVL Tree?', answer: 'BF = Height(Left) - Height(Right), must be in {-1, 0, +1}', subjectId: 'sub-ds', topic: 'AVL Trees', masteryLevel: 'mastered' },
      { id: 'fc-2', question: 'Which double rotation fixes an LR imbalance (BF = +2, child BF = -1)?', answer: 'Perform a Left rotation on the left child, followed by a Right rotation on the parent.', subjectId: 'sub-ds', topic: 'AVL Trees', masteryLevel: 'learning' },
      { id: 'fc-3', question: 'What is the maximum number of rotations needed during an AVL insertion?', answer: 'At most 1 single or 1 double rotation restores the tree balance.', subjectId: 'sub-ds', topic: 'AVL Trees', masteryLevel: 'learning' },
    ],
  },
  {
    id: 'note-02',
    title: 'DBMS: BCNF vs 3NF Comparison & Lossless Join Invariant',
    subjectId: 'sub-dbms',
    topic: '1NF, 2NF, 3NF & BCNF Decomposition',
    tags: ['Normalization', 'SQL', 'Theory'],
    isPinned: false,
    isArchived: false,
    updatedAt: '2026-09-06T14:15:00Z',
    content: `## 3NF vs BCNF Comparison

### 3NF Condition:
For every non-trivial Functional Dependency $X \\rightarrow Y$:
- $X$ is a Super Key, OR
- $Y$ is a Prime Attribute (part of a candidate key).

### BCNF (Boyce-Codd Normal Form) Condition:
For every non-trivial Functional Dependency $X \\rightarrow Y$:
- $X$ MUST strictly be a Super Key (no prime attribute exception!).

### Trade-offs:
- **3NF** always guarantees Lossless Join decomposition AND Dependency Preservation.
- **BCNF** guarantees Lossless Join and eliminates all redundancy based on FDs, but might NOT always preserve all functional dependencies.`,
    aiSummary: 'Highlights the fundamental difference between 3NF and BCNF: BCNF requires every determinant X to be a super key, whereas 3NF allows prime attribute targets to preserve dependencies.',
    flashcards: [
      { id: 'fc-4', question: 'Can every relational schema be decomposed into BCNF with dependency preservation?', answer: 'No. BCNF guarantees lossless join, but dependency preservation is only guaranteed in 3NF.', subjectId: 'sub-dbms', topic: 'Normalization', masteryLevel: 'learning' },
      { id: 'fc-5', question: 'What is the condition for a functional dependency X -> Y in BCNF?', answer: 'X must be a super key.', subjectId: 'sub-dbms', topic: 'Normalization', masteryLevel: 'mastered' },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    title: 'Assignment Due Tomorrow',
    message: 'B+ Tree Implementation (DBMS) is due tomorrow at 23:59. Estimated time remaining: 1h 20m.',
    type: 'deadline',
    timestamp: '2026-09-08T18:00:00Z',
    isRead: false,
    actionUrl: '/assignments',
  },
  {
    id: 'notif-02',
    title: 'Upcoming Test in 4 Days',
    message: 'Data Structures CAT 1 is on September 12. You have completed 42% of test preparation topics.',
    type: 'test',
    timestamp: '2026-09-08T10:00:00Z',
    isRead: false,
    actionUrl: '/tests',
  },
  {
    id: 'notif-03',
    title: 'AI Study Recommendation',
    message: 'You have 50 minutes free before evening dinner. Perfect window to finish your DBMS SQL homework.',
    type: 'ai_recommendation',
    timestamp: '2026-09-08T17:30:00Z',
    isRead: false,
    actionUrl: '/planner',
  },
  {
    id: 'notif-04',
    title: 'Study Streak Milestone',
    message: '🔥 6-Day Study Streak active! Complete 1 study session today to hit a full 7-day streak.',
    type: 'completed',
    timestamp: '2026-09-08T08:00:00Z',
    isRead: true,
    actionUrl: '/progress',
  },
];

export const INITIAL_BADGES: GamificationBadge[] = [
  { id: 'badge-1', name: 'First Week Master', description: 'Logged on and organized first 7 days of academic schedule', icon: '🏆', unlockedAt: '2026-09-07', progress: 7, maxProgress: 7 },
  { id: 'badge-2', name: '7-Day Study Streak', description: 'Maintained consecutive daily study sessions for 7 days', icon: '🔥', progress: 6, maxProgress: 7 },
  { id: 'badge-3', name: 'Deadline Master', description: 'Submitted 10 assignments on or before deadline without delay', icon: '⏱️', unlockedAt: '2026-09-01', progress: 10, maxProgress: 10 },
  { id: 'badge-4', name: 'Test Ready', description: 'Reached 90%+ preparation score on a scheduled exam', icon: '🎯', progress: 2, maxProgress: 3 },
  { id: 'badge-5', name: 'Syllabus 50% Milestone', description: 'Completed over 50% of the syllabus across all enrolled subjects', icon: '📚', unlockedAt: '2026-09-05', progress: 5, maxProgress: 5 },
  { id: 'badge-6', name: 'Deep Work Champion', description: 'Completed 20 uninterrupted Focus Mode sessions', icon: '⚡', progress: 14, maxProgress: 20 },
];

export const INITIAL_DAILY_GOAL: DailyGoal = {
  tasksTarget: 4,
  tasksCompleted: 2,
  studyMinutesTarget: 150, // 2h 30m
  studyMinutesCompleted: 45,
  testPrepMinutesTarget: 45,
  testPrepMinutesCompleted: 45,
};
