**Scriptorium** is a modern online platform designed for coding enthusiasts to write, execute, and share code in multiple programming languages. Inspired by the ancient scriptorium—a space where manuscripts were created and preserved—this digital scriptorium provides a secure, innovative environment for coders to experiment, refine, and save their work as reusable templates.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

---

## Features

Scriptorium offers a rich set of features to improve the coding experience:

### **1. Code Writing and Execution**

- Supports multiple programming languages: C, C++, Java, Python, JavaScript, etc.
- Real-time syntax highlighting for improved code readability.
- Execute code and view the output in real time.
- Supports standard input (stdin) for testing interactive programs.
- Displays error messages for easier debugging.

**Image:**  
![Code Writing and Execution](./images/CodeExecLight.png)

---

### **2. Secure Code Execution**

- Code runs in an isolated, secure environment to prevent interference with other users or the system.
- Enforces memory and time limits to handle long-running or resource-intensive code.

---

<!-- ### **3. Code Templates**

- Save and organize code as templates with titles, explanations, and tags.
- Edit or delete templates at any time.
- Fork existing templates, modify them, and save as new versions.
- Search templates by title, tags, or content.

**Image:**
![Code Templates](./images/code-templates.png) -->

### **3. Algorithm Classification**

- Utilizes my [CodeVecClassifier](https://github.com/1172097/CodeVecClassifier) model for algorithm identification.

- Automatically classify the type of algorithm in your Python code.
- Highlight the specific parts of the code with your mouse to get an accurate classification.
- Supports various algorithm types such as sorting, searching, DFS, BFS, etc.

**Image:**  
![Algorithm Classification](./images/Analyze.png)

---

### **4. Blog Posts and Discussions**

- Create, edit, and delete blog posts that can include links to code templates.
- Comment on or reply to existing blog posts.
- Upvote or downvote blog posts and comments.
- Browse and search blog posts by title, tags, or linked templates.

**Image:**  
![Blog Posts and Discussions](./images/BlogPostsHomeLight.png)
![Blog Posts and Discussions](./images/BlogPostViewLight.png)

---

### **5. Reporting Inappropriate Content**

- Report blog posts or comments for inappropriate content, including optional explanations.
- Admins can manage reported content and hide inappropriate posts.

**Image:**  
![Reporting Inappropriate Content](./images/ReportingBlogPost.png)

---

### **6. Responsive User Interface**

- Clean and intuitive design for a seamless user experience.
- Responsive across all devices: desktop, tablet, and mobile.
- Light and dark themes for personalized comfort.

**Image:**  
![Responsive User Interface](./images/CodeTemplatesHomeLight.png)
![Responsive User Interface](./images/CodeTemplatesHomeDark.png)

### Mobile View

**Image:**  
![Responsive User Interface](./images/CodeExecMobile.png)

**Image:**  
![Responsive User Interface](./images/CodeTemplateMobile.png)

### Index Page Light/Dark

![Responsive User Interface](./images/IndexLight.png)
![Responsive User Interface](./images/IndexDark.png)

---

## Tech Stack

The application is built using the following technologies:

- **Backend**:

  - [Next.js](https://nextjs.org)
  - [Prisma ORM](https://www.prisma.io)
  - REST API

- **Frontend**:

  - [React](https://reactjs.org)
  - [TailwindCSS](https://tailwindcss.com)

- **Environment & Tools**:
  - [Docker](https://www.docker.com)
  - Node.js 20+
  - Ubuntu 22.04
  - GCC, G++, Python 3.10+, Java 20+

---

## Setup Instructions

Follow these steps to set up the project on your local machine:

### **1. Prerequisites**

Ensure you have the following installed:

- Docker
- Node.js 20+
- Ubuntu 22.04 (or ensure compatibility with a similar environment)

### **2. Clone the Repository**

```bash
git clone <repository_url>
cd <repository_folder>
```
