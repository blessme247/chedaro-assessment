export  const permissionsData = [
    {
      label: "View users",
      value: "view_users",
      roles: ["super-admin", "admin"],
    },
    {
      label: "Manage Users",
      value: "manage_users",
      roles: ["super-admin", "admin"],
    },
    // {label: "View teams", value:"view_teams", roles: ["super-admin", "admin"]},{label: "Manage teams", value: "manage_teams", },
    {
      label: "View Organizations",
      value: "view_organizations",
      roles: ["super-admin"],
    },
    {
      label: "Manage organizations",
      value: "manage_organizations",
      roles: ["super-admin"],
    },
    {
      label: "View roles",
      value: "view_roles",
      roles: ["super-admin", "admin"],
    },
    { label: "Manage roles", value: "manage_roles", roles: ["super-admin"] },
    {
      label: "View audit trail",
      value: "view_audit_trail",
      roles: ["super-admin"],
    },
  ];