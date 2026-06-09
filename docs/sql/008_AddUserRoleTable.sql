-- 008_AddUserRoleTable.sql
-- Creates E_UserRole lookup table and replaces T_User.Role (nvarchar) with RoleId (tinyint FK).
-- Run against: TPA database, dbo schema.

USE TPA;
GO

-----------------------------------------------------------------------
-- Create E_UserRole
-----------------------------------------------------------------------

CREATE TABLE [dbo].[E_UserRole] (
    [Id]          tinyint      NOT NULL,
    [Code]        nvarchar(20) NOT NULL DEFAULT '',
    [Name]        nvarchar(50) NOT NULL DEFAULT '',
    [CreatedDate] datetime2    NOT NULL,
    [CreatedBy]   int          NOT NULL DEFAULT 0,
    [ModifiedDate] datetime2   NOT NULL,
    [ModifiedBy]  int          NOT NULL DEFAULT 0,
    CONSTRAINT [PK_E_UserRole] PRIMARY KEY ([Id])
);
GO

-- Seed the three roles
INSERT INTO [dbo].[E_UserRole] ([Id], [Code], [Name], [CreatedDate], [CreatedBy], [ModifiedDate], [ModifiedBy])
VALUES
    (1, 'ANON',  'Anonymous', GETUTCDATE(), 0, GETUTCDATE(), 0),
    (2, 'ADMIN', 'Admin',     GETUTCDATE(), 0, GETUTCDATE(), 0),
    (3, 'USER',  'User',      GETUTCDATE(), 0, GETUTCDATE(), 0);
GO

-----------------------------------------------------------------------
-- Migrate T_User.Role (nvarchar) → T_User.RoleId (tinyint FK)
-----------------------------------------------------------------------

-- 1. Add RoleId column; default to 3 (User) for existing rows
ALTER TABLE [dbo].[T_User]
    ADD [RoleId] tinyint NOT NULL DEFAULT 3;
GO

-- 2. Populate RoleId from existing Role string values
UPDATE [dbo].[T_User] SET [RoleId] = 1 WHERE [Role] = 'Anonymous';
UPDATE [dbo].[T_User] SET [RoleId] = 2 WHERE [Role] = 'Admin';
UPDATE [dbo].[T_User] SET [RoleId] = 3 WHERE [Role] = 'User';
GO

-- 3. Add FK index and constraint
CREATE INDEX [IX_T_User_RoleId] ON [dbo].[T_User] ([RoleId]);
GO

ALTER TABLE [dbo].[T_User]
    ADD CONSTRAINT [FK_T_User_E_UserRole_RoleId]
        FOREIGN KEY ([RoleId]) REFERENCES [dbo].[E_UserRole] ([Id]);
GO

-- 4. Drop old string Role column (remove its DEFAULT constraint first if present)
DECLARE @con NVARCHAR(200);
SELECT @con = dc.name
FROM   sys.default_constraints dc
JOIN   sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
JOIN   sys.tables  t ON c.object_id = t.object_id
JOIN   sys.schemas s ON t.schema_id = s.schema_id
WHERE  s.name = 'dbo' AND t.name = 'T_User' AND c.name = 'Role';
IF @con IS NOT NULL
    EXEC ('ALTER TABLE [dbo].[T_User] DROP CONSTRAINT [' + @con + ']');
GO

ALTER TABLE [dbo].[T_User] DROP COLUMN [Role];
GO
