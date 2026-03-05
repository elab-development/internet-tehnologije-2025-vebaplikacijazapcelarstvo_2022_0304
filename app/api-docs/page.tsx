"use client";

import SwaggerUI from "swagger-ui-react";

export default function ApiDocsPage() {
  return (
    <div className="swagger-wrapper">
      <SwaggerUI url="/api/swagger" />
    </div>
  );
}
