using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CasePortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // T_Membership: rename Date → CreatedDate, change date → datetime2, add audit columns
            migrationBuilder.RenameColumn(
                name:      "Date",
                schema:    "dbo",
                table:     "T_Membership",
                newName:   "CreatedDate");

            migrationBuilder.AlterColumn<DateTime>(
                name:       "CreatedDate",
                schema:     "dbo",
                table:      "T_Membership",
                type:       "datetime2",
                nullable:   false,
                oldClrType: typeof(DateOnly),
                oldType:    "date");

            migrationBuilder.AddColumn<int>(
                name:         "CreatedBy",
                schema:       "dbo",
                table:        "T_Membership",
                type:         "int",
                nullable:     false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name:         "ModifiedDate",
                schema:       "dbo",
                table:        "T_Membership",
                type:         "datetime2",
                nullable:     false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name:         "ModifiedBy",
                schema:       "dbo",
                table:        "T_Membership",
                type:         "int",
                nullable:     false,
                defaultValue: 0);

            // T_SubmissionGL: change CreatedDate date → datetime2, add audit columns
            migrationBuilder.AlterColumn<DateTime>(
                name:       "CreatedDate",
                schema:     "dbo",
                table:      "T_SubmissionGL",
                type:       "datetime2",
                nullable:   false,
                oldClrType: typeof(DateOnly),
                oldType:    "date");

            migrationBuilder.AddColumn<int>(
                name:         "CreatedBy",
                schema:       "dbo",
                table:        "T_SubmissionGL",
                type:         "int",
                nullable:     false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name:         "ModifiedDate",
                schema:       "dbo",
                table:        "T_SubmissionGL",
                type:         "datetime2",
                nullable:     false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name:         "ModifiedBy",
                schema:       "dbo",
                table:        "T_SubmissionGL",
                type:         "int",
                nullable:     false,
                defaultValue: 0);

            // T_User: change CreatedDate date → datetime2, add audit columns
            migrationBuilder.AlterColumn<DateTime>(
                name:       "CreatedDate",
                schema:     "dbo",
                table:      "T_User",
                type:       "datetime2",
                nullable:   false,
                oldClrType: typeof(DateOnly),
                oldType:    "date");

            migrationBuilder.AddColumn<int>(
                name:         "CreatedBy",
                schema:       "dbo",
                table:        "T_User",
                type:         "int",
                nullable:     false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name:         "ModifiedDate",
                schema:       "dbo",
                table:        "T_User",
                type:         "datetime2",
                nullable:     false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name:         "ModifiedBy",
                schema:       "dbo",
                table:        "T_User",
                type:         "int",
                nullable:     false,
                defaultValue: 0);

            // T_Company: change CreatedDate date → datetime2, add audit columns
            migrationBuilder.AlterColumn<DateTime>(
                name:       "CreatedDate",
                schema:     "dbo",
                table:      "T_Company",
                type:       "datetime2",
                nullable:   false,
                oldClrType: typeof(DateOnly),
                oldType:    "date");

            migrationBuilder.AddColumn<int>(
                name:         "CreatedBy",
                schema:       "dbo",
                table:        "T_Company",
                type:         "int",
                nullable:     false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name:         "ModifiedDate",
                schema:       "dbo",
                table:        "T_Company",
                type:         "datetime2",
                nullable:     false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name:         "ModifiedBy",
                schema:       "dbo",
                table:        "T_Company",
                type:         "int",
                nullable:     false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "CreatedBy",   schema: "dbo", table: "T_Company");
            migrationBuilder.DropColumn(name: "ModifiedDate",schema: "dbo", table: "T_Company");
            migrationBuilder.DropColumn(name: "ModifiedBy",  schema: "dbo", table: "T_Company");
            migrationBuilder.AlterColumn<DateOnly>(
                name: "CreatedDate", schema: "dbo", table: "T_Company",
                type: "date", nullable: false,
                oldClrType: typeof(DateTime), oldType: "datetime2");

            migrationBuilder.DropColumn(name: "CreatedBy",   schema: "dbo", table: "T_User");
            migrationBuilder.DropColumn(name: "ModifiedDate",schema: "dbo", table: "T_User");
            migrationBuilder.DropColumn(name: "ModifiedBy",  schema: "dbo", table: "T_User");
            migrationBuilder.AlterColumn<DateOnly>(
                name: "CreatedDate", schema: "dbo", table: "T_User",
                type: "date", nullable: false,
                oldClrType: typeof(DateTime), oldType: "datetime2");

            migrationBuilder.DropColumn(name: "CreatedBy",   schema: "dbo", table: "T_SubmissionGL");
            migrationBuilder.DropColumn(name: "ModifiedDate",schema: "dbo", table: "T_SubmissionGL");
            migrationBuilder.DropColumn(name: "ModifiedBy",  schema: "dbo", table: "T_SubmissionGL");
            migrationBuilder.AlterColumn<DateOnly>(
                name: "CreatedDate", schema: "dbo", table: "T_SubmissionGL",
                type: "date", nullable: false,
                oldClrType: typeof(DateTime), oldType: "datetime2");

            migrationBuilder.DropColumn(name: "CreatedBy",   schema: "dbo", table: "T_Membership");
            migrationBuilder.DropColumn(name: "ModifiedDate",schema: "dbo", table: "T_Membership");
            migrationBuilder.DropColumn(name: "ModifiedBy",  schema: "dbo", table: "T_Membership");
            migrationBuilder.AlterColumn<DateOnly>(
                name: "CreatedDate", schema: "dbo", table: "T_Membership",
                type: "date", nullable: false,
                oldClrType: typeof(DateTime), oldType: "datetime2");
            migrationBuilder.RenameColumn(
                name: "CreatedDate", schema: "dbo", table: "T_Membership", newName: "Date");
        }
    }
}
