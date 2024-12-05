// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files

// Timetable and Faculty Data
const timetable = {
    monday: [
        { time: "9:00-10:00", subject: "BCS502", faculty: "Prof. Syeda Arbeena Kausar (SAK)"},
        { time: "10:00-11:00", subject: "BCS501", faculty: "Prof. Manjunath N (MN)" },
        { time: "11:15-12:15", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "12:15-1:15", subject: "BCS515B", faculty: "Prof. Seema Firdose (SF)"},
        { time: "2:00-3:00", subject: "BRMK557", faculty: "Dr. Archana B (AB)" },
        { time: "3:00-4:00", subject: "BESK508", faculty: "Dr. Madhu Navale (MD)" },
        { time: "4:00-5:00", subject: "BCS501(R)", faculty: "Prof. Manjunath N (MN)"  },
    ],
    tuesday: [
        { time: "9:00-11:00", subject: "BCS502 (B2)/ BCSL504 (B3)/ BCS586 (B1)", faculty: "SAK / MN / MB" },
        { time: "11:00-12:00", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "12:15-1:15", subject: "BCS502", faculty: "Prof. Syeda Arbeena Kausar (SAK)" },
        { time: "2:00-3:00", subject: "BRMK557", faculty: "Dr. Archana B (AB)" },
        { time: "3:00-4:00", subject: "BCS502(R)", faculty: "Prof. Syeda Arbeena Kausar (SAK)" },
    ],
    wednesday: [
        { time: "9:00-11:00", subject: "BCS502 (B3)/ BCSL504 (B1)/ BCS586 (B2)", faculty: "SAK / MN / MB" },
        { time: "11:00-12:00", subject: "BCS501", faculty: "Prof. Manjunath N (MN)" },
        { time: "12:15-1:15", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "2:00-3:00", subject: "BCS515B (R)", faculty: "Prof. Seema Firdose (SF)" },
    ],
    thursday: [
        { time: "9:00-10:00", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "10:00-11:00", subject: "BRMK557", faculty: "Dr. Archana B (AB)" },
        { time: "11:00-12:00", subject: "BESK508", faculty: "Dr. Madhu Navale (MD)" },
        { time: "12:15-1:15", subject: "BCS515B", faculty: "Prof. Seema Firdose (SF)" },
        { time: "2:00-4:00", subject: "BCS502 (B1)/ BCSL504 (B2)/ BCS586 (B3)", faculty: "SAK / MN / MB" },
    ],
    friday: [
        { time: "9:00-10:00", subject: "BRMK557", faculty: "Dr. Archana B (AB)" },
        { time: "10:00-11:00", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "11:00-12:00", subject: "BCS501", faculty: "Prof. Manjunath N (MN)" },
        { time: "12:15-1:15", subject: "BCS515B", faculty: "Prof. Seema Firdose (SF)" },
        { time: "2:00-3:00", subject: "BCS503 (R)", faculty: "Prof. Vinutha N (VN)" },
        { time: "3:00-4:00", subject: "BRMK557 (R)", faculty: "Dr. Archana B (AB)" },
        { time: "4:00-5:00", subject: "Student Activity", faculty: "-" },
    ],
};


const subjects = {
    BCS501: { name: "Software Engineering & Project Management", faculty: "Prof. Manjunath N (MN)" },
    BCS502: { name: "Computer Networks", faculty: "Prof. Syeda Arbeena Kausar (SAK)" },
    BCS503: { name: "Theory of Computation", faculty: "Prof. Vinutha N (VN)" },
    BCS515B: { name: "Artificial Intelligence", faculty: "Prof. Seema Firdose (SF)" },
    BCS586: { name: "Mini Project", faculty: "Prof. Meghashree MB (MB) / Prof. Rumana Anjum (RA)" },
    BRMK557: { name: "Research Methodology and IPR", faculty: "Dr. Archana B (AB)" },
    BESK508: { name: "Environmental Studies", faculty: "Dr. Madhu Navale (MD)" },
};

// Class info
const classInfo = {
    teacher: "Prof. Meghashree MB",
    room: "A309",
    year: "2024-25",
};

// Function to generate responses based on user input
function generateResponse(prompt) {
    // Convert prompt to lowercase for easier comparison
    const lowerPrompt = prompt.toLowerCase();
    
    // Check for greetings
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
        return 'Hi there! How can I help you?';
    } else if (lowerPrompt.includes('how are you')) {
        return 'I am just a program, but thanks for asking!';
    } else {
        // Check for course and module inquiries
        const courseResponse = generateCourseResponse(prompt);
        const questionResponse = generateQuestionResponse(prompt);
        
        // Return the first non-empty response
        return courseResponse || questionResponse || 'I am not sure how to respond to that.';
    }
}

function generateCourseResponse(prompt) {
    // Convert prompt to lowercase for easier comparison
    const lowerPrompt = prompt.toLowerCase();

    // Define courses and their module topics
    const courses = {
        'software engineering and project management': [
            'Introduction to Software Engineering',
            'Software Development Life Cycle',
            'Project Management Fundamentals',
            'Agile Methodologies',
            'Software Quality Assurance'
        ],
        'computer networks': [
            'Network Models and Architectures',
            'Data Link Layer Protocols',
            'Network Layer and Routing',
            'Transport Layer Services',
            'Network Security Basics'
        ],
        'theory of computation': [
            'Automata Theory',
            'Regular Languages and Expressions',
            'Context-Free Grammars',
            'Turing Machines',
            'Computational Complexity'
        ],
        'web technology lab': [
            'HTML and CSS Basics',
            'JavaScript Programming',
            'Client-Server Architecture',
            'Web Frameworks',
            'Developing Dynamic Web Applications'
        ],
        'computer graphics': [
            'Graphics Hardware and Software',
            '2D and 3D Transformations',
            'Viewing and Clipping',
            'Rendering Techniques',
            'Animation and Simulation'
        ],
        'artificial intelligence': [
            'Introduction to AI',
            'Search Algorithms',
            'Knowledge Representation',
            'Machine Learning Basics',
            'AI Applications'
        ],
        'unix system programming': [
            'UNIX Operating System Overview',
            'File and Process Management',
            'Interprocess Communication',
            'Shell Programming',
            'System Calls and Libraries'
        ],
        'distributed systems': [
            'Distributed System Architectures',
            'Communication in Distributed Systems',
            'Synchronization and Coordination',
            'Fault Tolerance',
            'Distributed File Systems'
        ],
        'data visualization lab': [
            'Data Visualization Principles',
            'Visualization Tools and Libraries',
            'Designing Effective Charts',
            'Interactive Visualizations',
            'Case Studies'
        ],
        'computer vision': [
            'Image Formation and Representation',
            'Feature Detection and Matching',
            'Segmentation Techniques',
            'Object Recognition',
            'Motion Analysis'
        ],
        'research methodology & ipr': [
            'Research Design and Methods',
            'Data Collection and Analysis',
            'Technical Writing',
            'Intellectual Property Rights',
            'Patent Filing Process'
        ],
        'environmental studies': [
            'Ecosystems and Biodiversity',
            'Environmental Pollution',
            'Natural Resource Management',
            'Sustainable Development',
            'Environmental Policies'
        ]
    };
 
    // Check if the prompt matches any course
    for (const course in courses) {
        if (lowerPrompt.includes(course)) {
            return `The module topics for ${course} are:\n- ${courses[course].join('\n- ')}`;
        }
    }

    // Default response if no match is found
    return 'I am not sure how to respond to that.';
}


function generateQuestionResponse(prompt) {
    // Convert prompt to lowercase for easier comparison
    const lowerPrompt = prompt.toLowerCase();
    console.log("User Prompt:", lowerPrompt); // Debugging line

    // Define a mapping of keywords to topics
    const questions = {
        'module 1': [
            'Uses of computer networks',
            'OSI reference model',
            'TCP/IP reference model',
            'Guided and unguided transmission media',
            'Data flow and network topologies',
            'Standard protocols and physical layer'
        ],
        'module 2': [
            'Redundancy detection methods',
            'Data link layer design issues',
            'Error control and flow control',
            'Elementary data link protocols',
            'CSMA and collision-free protocols',
            'Wireless LANs and Ethernet'
        ],
        'module 3': [
            'Network layer design issues',
            'Routing algorithms',
            'Congestion control',
            'IPv4 and IPv6',
            'Packet fragmentation and tunneling'
        ],
        'module 4': [
            'Transport services',
            'Socket programming',
            'Connection management',
            'TCP and UDP',
            'Congestion control and performance issues'
        ],
        'module 5': [
            'Principles of network applications',
            'HTTP request-response behavior',
            'Electronic mail protocols (SMTP, POP3, IMAP)',
            'DNS and CDN',
            'Socket programming with UDP and TCP'
        ]
    };

    // Check if the prompt matches any module directly
    for (const module in questions) {
        if (lowerPrompt.includes(module)) {
            return `The questions for ${module} are:\n- ${questions[module].join('\n- ')}`;
        }
    }

    // Iterate over the questions to find a match
    for (const module in questions) {
        for (const question of questions[module]) {
            if (lowerPrompt.includes(question.toLowerCase())) {
                return `The question belongs to ${module}: "${question}".`;
            }
        }
    }

    // Default response if no match is found
    return 'I am not sure which module or question you are referring to.';
}


// Chatbot API
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    let response = "I didn't understand that. Can you rephrase?";

    // Timetable Queries
    if (userMessage.includes("timetable for") || userMessage.includes("what is the timetable of")) {
        const day = userMessage.split(/timetable for|what is the timetable of/)[1].trim();
        if (timetable[day]) {
            response = `
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse text-sm md:text-base">
                        <tr class="bg-black bg-opacity-20">
                            <th class="p-2 text-left border-b border-white border-opacity-20">Time</th>
                            <th class="p-2 text-left border-b border-white border-opacity-20">Subject</th>
                            <th class="p-2 text-left border-b border-white border-opacity-20">Faculty</th>
                        </tr>
                        ${timetable[day].map(
                            (slot) =>
                                `<tr class="hover:bg-black hover:bg-opacity-10">
                                    <td class="p-2 border-b border-white border-opacity-10">${slot.time}</td>
                                    <td class="p-2 border-b border-white border-opacity-10">${slot.subject}</td>
                                    <td class="p-2 border-b border-white border-opacity-10">${slot.faculty}</td>
                                </tr>`
                        ).join("")}
                    </table>
                </div>
            `;
        } else {
            response = `I don't have timetable data for ${day}.`;
        }
    }
    // Full Timetable Request
    else if (userMessage.includes("class teacher")) {
        response = `The class teacher is ${classInfo.teacher}.`;
    } else if (userMessage.includes("hod")) {
        response = `The Head of the department is ${classInfo.hod}.`;
    } 
    else if (userMessage.includes("who handles")) {
        const subjectCode = userMessage.split("who handles")[1].trim().toUpperCase();
        if (subjects[subjectCode]) {
            response = `${subjects[subjectCode].name} (${subjectCode}) is handled by ${subjects[subjectCode].faculty}.`;
        } else {
            response = `I don't have information on who handles ${subjectCode}.`;
        }
    }
    // Subject Details
    else if (userMessage.includes("what is")) {
        const subjectCode = userMessage.split("what is")[1].trim().toUpperCase();
        if (subjects[subjectCode]) {
            response = `${subjectCode} is ${subjects[subjectCode].name}, taught by ${subjects[subjectCode].faculty}.`;
        } else {
            response = `I don't have information on ${subjectCode}.`;
        }
    } else {
        // Use the generateResponse function for general queries
        response = generateResponse(userMessage) || generateCourseResponse(userMessage) || generateQuestionResponse(userMessage);
    }

    res.json({ response });
});

// Start Server
app.listen(3002, () => {
    console.log('Server is running on http://localhost:3002');
});