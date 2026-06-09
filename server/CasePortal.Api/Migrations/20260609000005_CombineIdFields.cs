using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CasePortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class CombineIdFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Nric",       schema: "dbo", table: "T_Membership");
            migrationBuilder.DropColumn(name: "PassportNo", schema: "dbo", table: "T_Membership");

            migrationBuilder.AddColumn<string>(
                name:         "IdType",
                schema:       "dbo",
                table:        "T_Membership",
                type:         "nvarchar(20)",
                maxLength:    20,
                nullable:     false,
                defaultValue: "NRIC");

            migrationBuilder.AddColumn<string>(
                name:         "IdNo",
                schema:       "dbo",
                table:        "T_Membership",
                type:         "nvarchar(30)",
                maxLength:    30,
                nullable:     false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "IdType", schema: "dbo", table: "T_Membership");
            migrationBuilder.DropColumn(name: "IdNo",   schema: "dbo", table: "T_Membership");

            migrationBuilder.AddColumn<string>(
                name:         "Nric",
                schema:       "dbo",
                table:        "T_Membership",
                type:         "nvarchar(20)",
                maxLength:    20,
                nullable:     false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name:         "PassportNo",
                schema:       "dbo",
                table:        "T_Membership",
                type:         "nvarchar(20)",
                maxLength:    20,
                nullable:     false,
                defaultValue: "");
        }
    }
}
