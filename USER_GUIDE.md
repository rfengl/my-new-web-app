# Case Portal — User Guide

This guide explains how to use the Case Portal to log in, view, create, and edit cases.

---

## Table of Contents

1. [Accessing the Portal](#1-accessing-the-portal)
2. [Logging In](#2-logging-in)
3. [Viewing Cases](#3-viewing-cases)
4. [Creating a New Case](#4-creating-a-new-case)
5. [Editing a Case](#5-editing-a-case)
6. [Logging Out](#6-logging-out)

---

## 1. Accessing the Portal

Open your web browser and go to the portal URL provided by your administrator.

> During development, the address is: **http://localhost:5173**

---

## 2. Logging In

When you open the portal, you will see the **Sign In** page.

**Steps:**
1. Enter your **email address** in the Email field.
2. Enter your **password** in the Password field.
3. Click **Sign in**.

If your credentials are correct, you will be taken to the Case Listing page automatically.

If the credentials are wrong, an error message will appear — check your email and password and try again.

> **Demo account:** `admin@example.com` / `password123`

---

## 3. Viewing Cases

After logging in, you will see the **Cases** page with a table listing all cases.

Each row in the table shows:

| Column | Description |
|---|---|
| **Case #** | Unique identifier (e.g. C-001) |
| **Title** | Short summary of the issue |
| **Priority** | How urgent the case is — High, Medium, or Low |
| **Status** | Current state — Open, In Progress, or Closed |
| **Date** | Date the case was created |

**Status badge colours:**

- 🟢 **Open** — case has been logged and is waiting to be worked on
- 🔵 **In Progress** — case is actively being worked on
- ⚪ **Closed** — case has been resolved

---

## 4. Creating a New Case

1. On the Cases page, click the **+ New Case** button in the top-right corner.
2. You will be taken to the New Case form.
3. Fill in the fields:

   | Field | Required | Description |
   |---|---|---|
   | **Title** | Yes | A short, clear summary of the issue |
   | **Description** | No | Full details of the issue |
   | **Status** | Yes | Start with **Open** for a new issue |
   | **Priority** | Yes | Set to **High**, **Medium**, or **Low** |

4. Click **Create Case** to save.

You will be returned to the Cases page and the new case will appear at the top of the list.

> Click **Cancel** or the back arrow at any time to go back without saving.

---

## 5. Editing a Case

1. On the Cases page, find the case you want to update.
2. Click the **Edit** button on the right side of that row.
3. You will be taken to the Edit Case form, pre-filled with the current details.
4. Make your changes to any of the fields.
5. Click **Save Changes** to save.

You will be returned to the Cases page with the updated information.

> Click **Cancel** or the back arrow to go back without saving any changes.

---

## 6. Logging Out

Click **Log out** in the top-right corner of the Cases page. You will be returned to the Sign In page.

> For security, always log out when you have finished using the portal, especially on a shared computer.
