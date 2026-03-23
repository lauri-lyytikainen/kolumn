'use client'

import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs"

export default function Dashboard() {
  const { organization } = useOrganization({
    memberships: {
      infinite: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your boards for the selected organization
        </p>
      </div>

      <div className="flex gap-2 justify-between align-middle">
        <h2 className="text-2xl font-bold">
          {organization ? organization.name : "Personal account"}
        </h2>
        <OrganizationSwitcher />
      </div>

      {/* Selected Organization Boards */}
    </div>
  )
}


