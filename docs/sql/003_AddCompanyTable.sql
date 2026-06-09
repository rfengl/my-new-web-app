-- Migration: 003_AddCompanyTable
-- Run as a user with db_owner on [TPA] (e.g. sa, or: ALTER ROLE db_owner ADD MEMBER rfeng)
-- Idempotent: wrapped in IF NOT EXISTS

USE [TPA];
GO

-- T_Company
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[T_Company]') AND type = 'U')
BEGIN
    CREATE TABLE [dbo].[T_Company] (
        [Id]          NVARCHAR(20)  NOT NULL,
        [Name]        NVARCHAR(200) NOT NULL,
        [Code]        NVARCHAR(50)  NOT NULL CONSTRAINT [DF_T_Company_Code]        DEFAULT (''),
        [IsActive]    BIT           NOT NULL CONSTRAINT [DF_T_Company_IsActive]    DEFAULT (1),
        [CreatedDate] NVARCHAR(10)  NOT NULL CONSTRAINT [DF_T_Company_CreatedDate] DEFAULT (''),
        CONSTRAINT [PK_T_Company] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END
GO

-- Add CompanyId column to T_User
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[T_User]') AND name = 'CompanyId')
BEGIN
    ALTER TABLE [dbo].[T_User]
        ADD [CompanyId] NVARCHAR(20) NULL;
END
GO

-- Foreign key T_User -> T_Company
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_T_User_T_Company_CompanyId')
BEGIN
    ALTER TABLE [dbo].[T_User]
        ADD CONSTRAINT [FK_T_User_T_Company_CompanyId]
        FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[T_Company] ([Id])
        ON DELETE SET NULL;
END
GO

-- Index on T_User.CompanyId
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[T_User]') AND name = 'IX_T_User_CompanyId')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_T_User_CompanyId] ON [dbo].[T_User] ([CompanyId] ASC);
END
GO

-- Seed default company
IF NOT EXISTS (SELECT 1 FROM [dbo].[T_Company] WHERE [Id] = 'CO-001')
    INSERT INTO [dbo].[T_Company] ([Id], [Name], [Code], [IsActive], [CreatedDate])
    VALUES ('CO-001', 'Default Company', 'DEFAULT', 1, CONVERT(NVARCHAR(10), GETDATE(), 23));
GO

-- Update default admin user to belong to the default company
UPDATE [dbo].[T_User]
SET    [CompanyId] = 'CO-001'
WHERE  [Id] = 'U-001' AND [CompanyId] IS NULL;
GO

-- Record migration
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]') AND type = 'U')
BEGIN
    CREATE TABLE [dbo].[__EFMigrationsHistory] (
        [MigrationId]    NVARCHAR(150) NOT NULL,
        [ProductVersion] NVARCHAR(32)  NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = '20260609000002_AddCompanyTable')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20260609000002_AddCompanyTable', '9.0.0');
GO
