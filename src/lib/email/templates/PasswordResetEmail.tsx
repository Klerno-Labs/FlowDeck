/**
 * Password Reset Email Template
 * Sends secure password reset links to users
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components';

interface PasswordResetEmailProps {
  email: string;
  resetUrl: string;
  expiryHours?: number;
}

export default function PasswordResetEmail({
  email,
  resetUrl,
  expiryHours = 1,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your FTC FlowDeck password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🔑 Reset Your Password</Heading>

          <Text style={text}>
            You requested to reset the password for your FTC FlowDeck account ({email}).
          </Text>

          <Text style={text}>
            Click the button below to set a new password:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            This link will expire in <strong>{expiryHours} hour{expiryHours !== 1 ? 's' : ''}</strong>.
          </Text>

          <Hr style={hr} />

          <Section style={warningSection}>
            <Text style={warningText}>
              <strong>Security Notice:</strong>
            </Text>
            <Text style={warningText}>
              • If you didn&apos;t request this password reset, you can safely ignore this email
            </Text>
            <Text style={warningText}>
              • Never share this reset link with anyone
            </Text>
            <Text style={warningText}>
              • This link can only be used once
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If the button doesn&apos;t work, copy and paste this URL into your browser:
          </Text>
          <Text style={linkText}>{resetUrl}</Text>

          <Text style={footer}>
            This is an automated email from FTC FlowDeck.
            If you have any questions, please contact your administrator.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
};

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 40px',
};

const buttonContainer = {
  padding: '24px 40px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const warningSection = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '16px 20px',
};

const warningText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '12px',
};

const linkText = {
  color: '#2563eb',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '4px',
  wordBreak: 'break-all' as const,
};
