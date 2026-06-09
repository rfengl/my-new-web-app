-- CasePortal Database Setup
-- Schema: TPA.dbo
-- Compatible with: SQL Server 2016+ / Azure SQL
--
-- PREREQUISITE: run the line below as 'sa' or a sysadmin first
-- if the executing login is not already a db_owner of TPA:
--
--   ALTER ROLE db_owner ADD MEMBER rfeng;
--

-- ============================================================
-- T_Membership
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables t
               JOIN sys.schemas s ON t.schema_id = s.schema_id
               WHERE s.name = 'dbo' AND t.name = 'T_Membership')
BEGIN
    CREATE TABLE [dbo].[T_Membership] (
        [Id]                    NVARCHAR(20)    NOT NULL,
        [Date]                  NVARCHAR(10)    NOT NULL DEFAULT '',
        [Name]                  NVARCHAR(200)   NOT NULL,
        [Nric]                  NVARCHAR(20)    NOT NULL DEFAULT '',
        [PassportNo]            NVARCHAR(20)    NOT NULL DEFAULT '',
        [Insurance]             NVARCHAR(100)   NOT NULL DEFAULT '',
        [Company]               NVARCHAR(200)   NOT NULL DEFAULT '',
        [PolicyNo]              NVARCHAR(50)    NOT NULL DEFAULT '',
        [RbEntitlement]         DECIMAL(18,2)   NOT NULL DEFAULT 0,
        [CoPayment]             DECIMAL(18,2)   NOT NULL DEFAULT 0,
        [CoInsurance]           NVARCHAR(50)    NOT NULL DEFAULT '',
        [Deductible]            DECIMAL(18,2)   NOT NULL DEFAULT 0,
        [PolicyEffDate]         NVARCHAR(10)    NOT NULL DEFAULT '',
        [PolicyExpDate]         NVARCHAR(10)    NOT NULL DEFAULT '',
        [PolicyLapseDate]       NVARCHAR(10)    NOT NULL DEFAULT '',
        [Status]                NVARCHAR(50)    NOT NULL DEFAULT 'Inforce',
        [UnderwritingExclusion] NVARCHAR(500)   NOT NULL DEFAULT '',
        [SubmissionId]          NVARCHAR(20)    NULL,
        CONSTRAINT [PK_T_Membership] PRIMARY KEY ([Id])
    );
    PRINT 'T_Membership created.';
END
ELSE
    PRINT 'T_Membership already exists — skipped.';

-- ============================================================
-- T_SubmissionGL
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables t
               JOIN sys.schemas s ON t.schema_id = s.schema_id
               WHERE s.name = 'dbo' AND t.name = 'T_SubmissionGL')
BEGIN
    CREATE TABLE [dbo].[T_SubmissionGL] (
        [Id]                   NVARCHAR(20)    NOT NULL,
        [MembershipId]         NVARCHAR(20)    NOT NULL,
        [SubmissionStatus]     NVARCHAR(50)    NOT NULL DEFAULT '',
        [RequestType]          NVARCHAR(100)   NOT NULL DEFAULT '',
        [GlType]               INT             NOT NULL DEFAULT 0,
        [Mrn]                  NVARCHAR(50)    NOT NULL DEFAULT '',
        [BillingDate]          NVARCHAR(10)    NOT NULL DEFAULT '',
        [DateOfAdmission]      NVARCHAR(10)    NOT NULL DEFAULT '',
        [DateOfDischarge]      NVARCHAR(10)    NOT NULL DEFAULT '',
        [DoctorName]           NVARCHAR(200)   NOT NULL DEFAULT '',
        [DoctorSpecialty]      NVARCHAR(100)   NOT NULL DEFAULT '',
        [ProvisionalDiagnosis] NVARCHAR(500)   NOT NULL DEFAULT '',
        [IcdCode]              NVARCHAR(20)    NOT NULL DEFAULT '',
        [EstimatedCost]        DECIMAL(18,2)   NOT NULL DEFAULT 0,
        [CreatedDate]          NVARCHAR(10)    NOT NULL DEFAULT '',
        CONSTRAINT [PK_T_SubmissionGL] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_T_SubmissionGL_T_Membership]
            FOREIGN KEY ([MembershipId]) REFERENCES [dbo].[T_Membership]([Id])
    );
    PRINT 'T_SubmissionGL created.';
END
ELSE
    PRINT 'T_SubmissionGL already exists — skipped.';

-- ============================================================
-- EF Core migrations history (required for dotnet ef)
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables t
               JOIN sys.schemas s ON t.schema_id = s.schema_id
               WHERE s.name = 'dbo' AND t.name = '__EFMigrationsHistory')
BEGIN
    CREATE TABLE [dbo].[__EFMigrationsHistory] (
        [MigrationId]    NVARCHAR(150) NOT NULL,
        [ProductVersion] NVARCHAR(32)  NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
    INSERT INTO [dbo].[__EFMigrationsHistory] VALUES ('20260609000000_InitialCreate', '9.0.0');
    PRINT '__EFMigrationsHistory created and seeded.';
END
ELSE
    PRINT '__EFMigrationsHistory already exists — skipped.';
