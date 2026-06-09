using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CasePortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "T_Membership",
                schema: "dbo",
                columns: table => new
                {
                    Id                    = table.Column<string>(type: "nvarchar(20)",  maxLength: 20,  nullable: false),
                    Date                  = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                    Name                  = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Nric                  = table.Column<string>(type: "nvarchar(20)",  maxLength: 20,  nullable: false, defaultValue: ""),
                    PassportNo            = table.Column<string>(type: "nvarchar(20)",  maxLength: 20,  nullable: false, defaultValue: ""),
                    Insurance             = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: ""),
                    Company               = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false, defaultValue: ""),
                    PolicyNo              = table.Column<string>(type: "nvarchar(50)",  maxLength: 50,  nullable: false, defaultValue: ""),
                    RbEntitlement         = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    CoPayment             = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    CoInsurance           = table.Column<string>(type: "nvarchar(50)",  maxLength: 50,  nullable: false, defaultValue: ""),
                    Deductible            = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    PolicyEffDate         = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                    PolicyExpDate         = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                    PolicyLapseDate       = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                    Status                = table.Column<string>(type: "nvarchar(50)",  maxLength: 50,  nullable: false, defaultValue: "Inforce"),
                    UnderwritingExclusion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false, defaultValue: ""),
                    SubmissionId          = table.Column<string>(type: "nvarchar(20)",  maxLength: 20,  nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_Membership", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_SubmissionGL",
                schema: "dbo",
                columns: table => new
                {
                    Id                   = table.Column<string>(type: "nvarchar(20)",  maxLength: 20,  nullable: false),
                    MembershipId         = table.Column<string>(type: "nvarchar(20)",  maxLength: 20,  nullable: false),
                    SubmissionStatus     = table.Column<string>(type: "nvarchar(50)",  maxLength: 50,  nullable: false, defaultValue: ""),
                    RequestType          = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: ""),
                    GlType               = table.Column<int>(   type: "int",                          nullable: false, defaultValue: 0),
                    Mrn                  = table.Column<string>(type: "nvarchar(50)",  maxLength: 50,  nullable: false, defaultValue: ""),
                    BillingDate          = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                    DateOfAdmission      = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                    DateOfDischarge      = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                    DoctorName           = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false, defaultValue: ""),
                    DoctorSpecialty      = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: ""),
                    ProvisionalDiagnosis = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false, defaultValue: ""),
                    IcdCode              = table.Column<string>(type: "nvarchar(20)",  maxLength: 20,  nullable: false, defaultValue: ""),
                    EstimatedCost        = table.Column<decimal>(type: "decimal(18,2)",               nullable: false, defaultValue: 0m),
                    CreatedDate          = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_SubmissionGL", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_SubmissionGL_T_Membership_MembershipId",
                        column: x => x.MembershipId,
                        principalSchema: "dbo",
                        principalTable: "T_Membership",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_T_SubmissionGL_MembershipId",
                table: "T_SubmissionGL",
                column: "MembershipId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "T_SubmissionGL", schema: "dbo");
            migrationBuilder.DropTable(name: "T_Membership",   schema: "dbo");
        }
    }
}
