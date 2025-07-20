# QuickDo 🚀

QuickDo is a lightweight, fast, and professional task management application built on React (TSX), Frappe, and custom APIs. Engineered for productivity, QuickDo delivers a modern, intuitive UI with seamless task entry, powerful filtering, robust categorization, and optimized workflow management across devices.

With frequent enhancements, QuickDo powers teams and individuals with ultra-fast, distraction-free, and reliable task handling.

## ✨ Key Features

### 📝 Productivity and Task Management
- **Fast Task Entry**  
  Quickly add, edit, and organize tasks with minimal effort.
- **Smart Filtering & Categorization**  
  Advanced filters (including due date) and custom categories for clear, organized task lists.
- **Category Management**  
  Manage and browse task categories with an intuitive, modular interface.

### 💻 User Experience & Interface
- **Clean, Professional UI**  
  Modern, distraction-free user interface for all users.
- **Polished Animations & Interactions**  
  Smooth animations, dropdowns, and refined UI elements.
- **Personalized User Settings**  
  Easy access to your personal settings and preferences.

### 📱 Responsive & Accessible
- **Fully Responsive Design**  
  Optimized layouts for desktop, tablet, and mobile.
- **Kanban Board View**  
  Visualize tasks in a board interface for better workflow management.

### 🔒 Security & Control
- **Role-Based Access & Permissions**  
  Fine-grained controls ensure users see only what’s relevant.
- **Security Best Practices**  
  CSRF protection and secure workflows for reliability.

### ⚙️ Performance & Code Quality
- **Optimized Performance**  
  Built with React, TypeScript, Frappe, and APIs for speed and robustness.
- **Automated Code Quality**  
  Integration with GitHub CI and pre-commit hooks for consistent, high-quality code.
- **Clean, Maintainable Codebase**  
  Modular code structure, reusable components, and optimized assets.

## 🖼️ Screenshots

**Clean and Modern Dashboard UI**  
![Screenshot 2025-03-12 234400](https://github.com/user-attachments/assets/71546927-e804-4819-af9b-bd872bef8ca0)

![Screenshot 2025-03-12 234442](https://github.com/user-attachments/assets/ddcf4fdc-9e09-4c85-9b88-a93f12e22ca5)

![Screenshot 2025-03-12 234454](https://github.com/user-attachments/assets/24239cb5-3ba0-44f3-80bc-274dfcf03a94)

**Today's Task List with Fast Edit/Complete Actions**  
![Screenshot 2025-03-12 234601](https://github.com/user-attachments/assets/73df4a45-2c68-4b68-a252-6faec4284178)

**Editing Tasks and Details using the task details drawer**  
![Screenshot 2025-03-12 234634](https://github.com/user-attachments/assets/6678b4b9-2b8a-400b-bbd7-04eb9fba6cbc)

**Advanced Filtering in the Inbox and Group By Views**
![Screenshot 2025-03-12 234649](https://github.com/user-attachments/assets/cb9bf421-2832-4e9c-bbad-406507a27b4e)

**Calendar View with Drag-and-Drop, and Task Detail Drawer**  
![Screenshot 2025-03-12 234714](https://github.com/user-attachments/assets/1e5baecb-736f-47ad-8bb8-4490c1734300)

**Kanban View with Drag-and-Drop, Direct Subject Edit, and Task Detail Drawer**  
![Screenshot 2025-03-12 234723](https://github.com/user-attachments/assets/2c3b4897-afd6-4b3a-ade7-0b8f7ba6724d)

**Category Management Page**  
![Screenshot 2025-03-12 234736](https://github.com/user-attachments/assets/bbcc56ad-3e08-4f7e-b819-f926806e5dfd)


## 🔧 Installation & Setup

**Pre-requisites:**  
- Node.js **v22** (tested with v22.17.1, latest as of July 2025)
- Frappe framework and [bench](https://github.com/frappe/bench) CLI

To install QuickDo as a Frappe app:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch main
bench install-app quickdo
```

## 🤝 Contributing

We welcome contributions! 🎉 Help us make QuickDo better.

**Pre-commit Hooks:**  
This project uses **pre-commit** to enforce code formatting and linting:

```bash
cd apps/quickdo
pre-commit install
```

## 📜 License

QuickDo is licensed under the **AGPL-3.0**.

🚀 **Start managing your tasks faster and smarter with QuickDo today!**
