-- Migration: 004_IntegerPrimaryKeys
-- DESTRUCTIVE — drops and recreates all tables with INT IDENTITY primary keys.
-- Run in a dev environment with no production data, or back up first.
-- Prerequisite: run as a user with db_owner on [TPA]

USE [TPA];
GO

-- ── Drop existing FK constraints ──────────────────────────────────────────────
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_T_SubmissionGL_T_Membership_MembershipId')
    ALTER TABLE [dbo].[T_SubmissionGL] DROP CONSTRAINT [FK_T_SubmissionGL_T_Membership_MembershipId];
GO
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_T_User_T_Company_CompanyId')
    ALTER TABLE [dbo].[T_User] DROP CONSTRAINT [FK_T_User_T_Company_CompanyId];
GO

-- ── Drop old tables ───────────────────────────────────────────────────────────
IF OBJECT_ID(N'[dbo].[T_SubmissionGL]', 'U') IS NOT NULL DROP TABLE [dbo].[T_SubmissionGL];
IF OBJECT_ID(N'[dbo].[T_User]',         'U') IS NOT NULL DROP TABLE [dbo].[T_User];
IF OBJECT_ID(N'[dbo].[T_Membership]',   'U') IS NOT NULL DROP TABLE [dbo].[T_Membership];
IF OBJECT_ID(N'[dbo].[T_Company]',      'U') IS NOT NULL DROP TABLE [dbo].[T_Company];
GO

-- ── T_Company ─────────────────────────────────────────────────────────────────
CREATE TABLE [dbo].[T_Company] (
    [Id]          INT           NOT NULL IDENTITY(1,1),
    [Name]        NVARCHAR(200) NOT NULL,
    [Code]        NVARCHAR(50)  NOT NULL CONSTRAINT [DF_T_Company_Code]        DEFAULT (''),
    [IsActive]    BIT           NOT NULL CONSTRAINT [DF_T_Company_IsActive]    DEFAULT (1),
    [CreatedDate] NVARCHAR(10)  NOT NULL CONSTRAINT [DF_T_Company_CreatedDate] DEFAULT (''),
    CONSTRAINT [PK_T_Company] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- ── T_Membership ──────────────────────────────────────────────────────────────
CREATE TABLE [dbo].[T_Membership] (
    [Id]                    INT              NOT NULL IDENTITY(1,1),
    [Date]                  NVARCHAR(10)     NOT NULL CONSTRAINT [DF_T_Membership_Date]        DEFAULT (''),
    [Name]                  NVARCHAR(200)    NOT NULL,
    [Nric]                  NVARCHAR(20)     NOT NULL CONSTRAINT [DF_T_Membership_Nric]        DEFAULT (''),
    [PassportNo]            NVARCHAR(20)     NOT NULL CONSTRAINT [DF_T_Membership_PassportNo]  DEFAULT (''),
    [Insurance]             NVARCHAR(100)    NOT NULL CONSTRAINT [DF_T_Membership_Insurance]   DEFAULT (''),
    [Company]               NVARCHAR(200)    NOT NULL CONSTRAINT [DF_T_Membership_Company]     DEFAULT (''),
    [PolicyNo]              NVARCHAR(50)     NOT NULL CONSTRAINT [DF_T_Membership_PolicyNo]    DEFAULT (''),
    [RbEntitlement]         DECIMAL(18,2)    NOT NULL CONSTRAINT [DF_T_Membership_RbEnt]       DEFAULT (0),
    [CoPayment]             DECIMAL(18,2)    NOT NULL CONSTRAINT [DF_T_Membership_CoPayment]   DEFAULT (0),
    [CoInsurance]           NVARCHAR(50)     NOT NULL CONSTRAINT [DF_T_Membership_CoIns]       DEFAULT (''),
    [Deductible]            DECIMAL(18,2)    NOT NULL CONSTRAINT [DF_T_Membership_Deductible]  DEFAULT (0),
    [PolicyEffDate]         NVARCHAR(10)     NOT NULL CONSTRAINT [DF_T_Membership_EffDate]     DEFAULT (''),
    [PolicyExpDate]         NVARCHAR(10)     NOT NULL CONSTRAINT [DF_T_Membership_ExpDate]     DEFAULT (''),
    [PolicyLapseDate]       NVARCHAR(10)     NOT NULL CONSTRAINT [DF_T_Membership_LapseDate]   DEFAULT (''),
    [Status]                NVARCHAR(50)     NOT NULL CONSTRAINT [DF_T_Membership_Status]      DEFAULT ('Inforce'),
    [UnderwritingExclusion] NVARCHAR(500)    NOT NULL CONSTRAINT [DF_T_Membership_UWExcl]      DEFAULT (''),
    [SubmissionId]          INT              NULL,
    CONSTRAINT [PK_T_Membership] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- ── T_SubmissionGL ────────────────────────────────────────────────────────────
CREATE TABLE [dbo].[T_SubmissionGL] (
    [Id]                   INT           NOT NULL IDENTITY(1,1),
    [MembershipId]         INT           NOT NULL,
    [SubmissionStatus]     NVARCHAR(50)  NOT NULL CONSTRAINT [DF_T_SubGL_Status]     DEFAULT (''),
    [RequestType]          NVARCHAR(100) NOT NULL CONSTRAINT [DF_T_SubGL_ReqType]    DEFAULT (''),
    [GlType]               INT           NOT NULL CONSTRAINT [DF_T_SubGL_GlType]     DEFAULT (0),
    [Mrn]                  NVARCHAR(50)  NOT NULL CONSTRAINT [DF_T_SubGL_Mrn]        DEFAULT (''),
    [BillingDate]          NVARCHAR(10)  NOT NULL CONSTRAINT [DF_T_SubGL_BillDate]   DEFAULT (''),
    [DateOfAdmission]      NVARCHAR(10)  NOT NULL CONSTRAINT [DF_T_SubGL_AdmDate]    DEFAULT (''),
    [DateOfDischarge]      NVARCHAR(10)  NOT NULL CONSTRAINT [DF_T_SubGL_DisDate]    DEFAULT (''),
    [DoctorName]           NVARCHAR(200) NOT NULL CONSTRAINT [DF_T_SubGL_DoctorName] DEFAULT (''),
    [DoctorSpecialty]      NVARCHAR(100) NOT NULL CONSTRAINT [DF_T_SubGL_DoctorSpec] DEFAULT (''),
    [ProvisionalDiagnosis] NVARCHAR(500) NOT NULL CONSTRAINT [DF_T_SubGL_Diagnosis]  DEFAULT (''),
    [IcdCode]              NVARCHAR(20)  NOT NULL CONSTRAINT [DF_T_SubGL_IcdCode]    DEFAULT (''),
    [EstimatedCost]        DECIMAL(18,2) NOT NULL CONSTRAINT [DF_T_SubGL_Cost]       DEFAULT (0),
    [CreatedDate]          NVARCHAR(10)  NOT NULL CONSTRAINT [DF_T_SubGL_Created]    DEFAULT (''),
    CONSTRAINT [PK_T_SubmissionGL] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_T_SubmissionGL_T_Membership_MembershipId]
        FOREIGN KEY ([MembershipId]) REFERENCES [dbo].[T_Membership] ([Id]) ON DELETE CASCADE
);
CREATE NONCLUSTERED INDEX [IX_T_SubmissionGL_MembershipId] ON [dbo].[T_SubmissionGL] ([MembershipId] ASC);
GO

-- ── T_User ────────────────────────────────────────────────────────────────────
CREATE TABLE [dbo].[T_User] (
    [Id]           INT           NOT NULL IDENTITY(1,1),
    [Email]        NVARCHAR(200) NOT NULL,
    [PasswordHash] NVARCHAR(500) NOT NULL,
    [Name]         NVARCHAR(200) NOT NULL,
    [Role]         NVARCHAR(50)  NOT NULL CONSTRAINT [DF_T_User_Role]        DEFAULT ('User'),
    [IsActive]     BIT           NOT NULL CONSTRAINT [DF_T_User_IsActive]    DEFAULT (1),
    [CreatedDate]  NVARCHAR(10)  NOT NULL CONSTRAINT [DF_T_User_CreatedDate] DEFAULT (''),
    [CompanyId]    INT           NULL,
    CONSTRAINT [PK_T_User] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_T_User_T_Company_CompanyId]
        FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[T_Company] ([Id]) ON DELETE SET NULL
);
CREATE UNIQUE NONCLUSTERED INDEX [UX_T_User_Email]     ON [dbo].[T_User] ([Email] ASC);
CREATE NONCLUSTERED INDEX        [IX_T_User_CompanyId] ON [dbo].[T_User] ([CompanyId] ASC);
GO

-- ── EF migrations history ─────────────────────────────────────────────────────
IF OBJECT_ID(N'[dbo].[__EFMigrationsHistory]', 'U') IS NOT NULL
    DELETE FROM [dbo].[__EFMigrationsHistory];
ELSE
    CREATE TABLE [dbo].[__EFMigrationsHistory] (
        [MigrationId]    NVARCHAR(150) NOT NULL,
        [ProductVersion] NVARCHAR(32)  NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
GO

INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES
    ('20260609000000_InitialCreate',     '9.0.0'),
    ('20260609000001_AddUserTable',      '9.0.0'),
    ('20260609000002_AddCompanyTable',   '9.0.0'),
    ('20260609000003_IntegerPrimaryKeys','9.0.0');
GO

-- NOTE: Default company + admin user are seeded automatically by DatabaseSeeder
--       on first application startup after running this script.
