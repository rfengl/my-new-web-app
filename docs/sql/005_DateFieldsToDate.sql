-- Migration: 005_DateFieldsToDate
-- Converts NVARCHAR(10) date columns to the SQL Server DATE type.
-- Safe to run on a fresh database created by 004_IntegerPrimaryKeys.sql (no data loss).
-- For databases with existing data: '' values in non-nullable date columns will cause
-- ALTER COLUMN to fail — UPDATE those rows to a valid date first.
-- Prerequisite: db_owner on [TPA].

USE [TPA];
GO

-- ── Helper: drop a default constraint by column name ─────────────────────────
-- (Handles both named constraints from the SQL script and auto-named ones from EF)

DECLARE @sql NVARCHAR(500);

-- T_Membership.Date
SELECT @sql = 'ALTER TABLE [dbo].[T_Membership] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_Membership' AND c.name = 'Date';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_Membership] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_Membership' AND c.name = 'PolicyEffDate';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_Membership] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_Membership' AND c.name = 'PolicyExpDate';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_Membership] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_Membership' AND c.name = 'PolicyLapseDate';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_SubmissionGL] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_SubmissionGL' AND c.name = 'BillingDate';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_SubmissionGL] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_SubmissionGL' AND c.name = 'DateOfAdmission';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_SubmissionGL] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_SubmissionGL' AND c.name = 'DateOfDischarge';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_SubmissionGL] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_SubmissionGL' AND c.name = 'CreatedDate';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_User] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_User' AND c.name = 'CreatedDate';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_Company] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_Company' AND c.name = 'CreatedDate';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

-- ── ALTER COLUMN to DATE ──────────────────────────────────────────────────────

-- T_Membership
ALTER TABLE [dbo].[T_Membership] ALTER COLUMN [Date]            DATE NOT NULL;
ALTER TABLE [dbo].[T_Membership] ALTER COLUMN [PolicyEffDate]   DATE NULL;
ALTER TABLE [dbo].[T_Membership] ALTER COLUMN [PolicyExpDate]   DATE NULL;
ALTER TABLE [dbo].[T_Membership] ALTER COLUMN [PolicyLapseDate] DATE NULL;
GO

-- T_SubmissionGL
ALTER TABLE [dbo].[T_SubmissionGL] ALTER COLUMN [BillingDate]     DATE NULL;
ALTER TABLE [dbo].[T_SubmissionGL] ALTER COLUMN [DateOfAdmission] DATE NULL;
ALTER TABLE [dbo].[T_SubmissionGL] ALTER COLUMN [DateOfDischarge] DATE NULL;
ALTER TABLE [dbo].[T_SubmissionGL] ALTER COLUMN [CreatedDate]     DATE NOT NULL;
GO

-- T_User
ALTER TABLE [dbo].[T_User] ALTER COLUMN [CreatedDate] DATE NOT NULL;
GO

-- T_Company
ALTER TABLE [dbo].[T_Company] ALTER COLUMN [CreatedDate] DATE NOT NULL;
GO

-- ── Record migration ──────────────────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = '20260609000004_DateFieldsToDate')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20260609000004_DateFieldsToDate', '9.0.0');
GO
