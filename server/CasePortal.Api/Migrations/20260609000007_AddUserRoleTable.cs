using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CasePortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRoleTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create E_UserRole lookup table
            migrationBuilder.CreateTable(
                name:   "E_UserRole",
                schema: "dbo",
                columns: t => new
                {
                    Id           = t.Column<byte>    (type: "tinyint",    nullable: false),
                    Code         = t.Column<string>  (type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: ""),
                    Name         = t.Column<string>  (type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: ""),
                    CreatedDate  = t.Column<DateTime>(type: "datetime2",  nullable: false),
                    CreatedBy    = t.Column<int>     (type: "int",        nullable: false, defaultValue: 0),
                    ModifiedDate = t.Column<DateTime>(type: "datetime2",  nullable: false),
                    ModifiedBy   = t.Column<int>     (type: "int",        nullable: false, defaultValue: 0),
                },
                constraints: t =>
                {
                    t.PrimaryKey("PK_E_UserRole", x => x.Id);
                });

            // Add RoleId column to T_User (default 3 = User for existing rows)
            migrationBuilder.AddColumn<byte>(
                name:         "RoleId",
                schema:       "dbo",
                table:        "T_User",
                type:         "tinyint",
                nullable:     false,
                defaultValue: (byte)3);

            // Add FK index + constraint
            migrationBuilder.CreateIndex(
                name:    "IX_T_User_RoleId",
                schema:  "dbo",
                table:   "T_User",
                column:  "RoleId");

            migrationBuilder.AddForeignKey(
                name:            "FK_T_User_E_UserRole_RoleId",
                schema:          "dbo",
                table:           "T_User",
                column:          "RoleId",
                principalSchema: "dbo",
                principalTable:  "E_UserRole",
                principalColumn: "Id",
                onDelete:        ReferentialAction.Restrict);

            // Drop old string Role column
            migrationBuilder.DropColumn(
                name:   "Role",
                schema: "dbo",
                table:  "T_User");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name:   "FK_T_User_E_UserRole_RoleId",
                schema: "dbo",
                table:  "T_User");

            migrationBuilder.DropIndex(
                name:   "IX_T_User_RoleId",
                schema: "dbo",
                table:  "T_User");

            migrationBuilder.DropColumn(
                name:   "RoleId",
                schema: "dbo",
                table:  "T_User");

            migrationBuilder.AddColumn<string>(
                name:         "Role",
                schema:       "dbo",
                table:        "T_User",
                type:         "nvarchar(50)",
                maxLength:    50,
                nullable:     false,
                defaultValue: "User");

            migrationBuilder.DropTable(
                name:   "E_UserRole",
                schema: "dbo");
        }
    }
}
