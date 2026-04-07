<template>
  <div class="info-panel">
    <h2>🔑 How Authentication Works</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <div class="step-content">
          <h3>Enter your User ID</h3>
          <p>
            Type a unique identifier in the <strong>User ID</strong> field
            above. This can be any string that identifies a user session.
          </p>
        </div>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <div class="step-content">
          <h3>Click Authenticate</h3>
          <p>
            The Vue frontend sends a <code>POST /auth/token</code> request
            to the Fastify backend with the provided UID.
          </p>
        </div>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <div class="step-content">
          <h3>Backend exchanges credentials</h3>
          <p>
            The Fastify server securely authenticates with the Beefree API using
            your <code>client_id</code> and <code>client_secret</code>
            (stored server-side in <code>.env</code>) and returns a JWT token.
          </p>
        </div>
      </div>
      <div class="step">
        <div class="step-number">4</div>
        <div class="step-content">
          <h3>Builder loads</h3>
          <p>
            The frontend receives the JWT token and initializes the
            <strong>Beefree email builder</strong> with drag-and-drop editing
            capabilities.
          </p>
        </div>
      </div>
    </div>

    <div class="security-note">
      <strong>🛡️ Security</strong>
      <p>
        API credentials are never exposed to the browser. Only a temporary JWT
        token is sent to the frontend. Monitor the API calls in the right panel.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.info-panel {
  padding: 40px 32px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
h2 {
  margin: 0 0 28px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}
.steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
}
.step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: #7638ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
}
.step-content h3 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
.step-content p {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}
.step-content code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}
.security-note {
  background: #f3f0ff;
  border: 1px solid #d4c8ff;
  border-radius: 6px;
  padding: 16px;
}
.security-note strong {
  display: block;
  margin-bottom: 6px;
  color: #5a2db5;
  font-size: 14px;
}
.security-note p {
  margin: 0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}
</style>
