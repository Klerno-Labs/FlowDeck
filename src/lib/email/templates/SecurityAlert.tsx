/**
 * Security Alert Email Template
 * Sends notifications for security-related events
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
  Hr,
} from '@react-email/components';

type SecurityAlertType =
  | 'new_login'
  | 'suspicious_activity'
  | 'account_locked'
  | 'password_changed';

interface SecurityAlertProps {
  type: SecurityAlertType;
  email: string;
  timestamp: string;
  ipAddress?: string;
  browser?: string;
  os?: string;
  location?: string;
  details?: string;
}

const alertContent = {
  new_login: {
    subject: 'New Login to Your FTC FlowDeck Account',
    title: '🔐 New Login Detected',
    message: 'We detected a new login to your FTC FlowDeck account.',
    action: "If this wasn't you, please change your password immediately and review your account activity.",
  },
  suspicious_activity: {
    subject: '⚠️ Suspicious Activity Detected',
    title: '⚠️ Suspicious Activity Alert',
    message: 'We detected unusual activity on your FTC FlowDeck account.',
    action: 'Please review your recent login history. If you don\'t recognize this activity, change your password immediately.',
  },
  account_locked: {
    subject: '🔒 Your Account Has Been Locked',
    title: '🔒 Account Locked',
    message: 'Your account has been temporarily locked due to multiple failed login attempts.',
    action: 'Your account will be automatically unlocked after 1 hour. If you didn\'t attempt to log in, please contact support.',
  },
  password_changed: {
    subject: '✅ Password Changed Successfully',
    title: '✅ Password Changed',
    message: 'Your FTC FlowDeck password was successfully changed.',
    action: "If you didn't make this change, please contact support immediately.",
  },
};

export default function SecurityAlert({
  type,
  email,
  timestamp,
  ipAddress,
  browser,
  os,
  location,
  details,
}: SecurityAlertProps) {
  const content = alertContent[type];

  return (
    <Html>
      <Head />
      <Preview>{content.subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{content.title}</Heading>

          <Text style={text}>{content.message}</Text>

          <Section style={detailsSection}>
            <Text style={detailsTitle}>Event Details:</Text>
            <Hr style={hr} />
            <Text style={detailItem}>
              <strong>Account:</strong> {email}
            </Text>
            <Text style={detailItem}>
              <strong>Time:</strong> {timestamp}
            </Text>
            {ipAddress && (
              <Text style={detailItem}>
                <strong>IP Address:</strong> {ipAddress}
              </Text>
            )}
            {browser && (
              <Text style={detailItem}>
                <strong>Browser:</strong> {browser}
              </Text>
            )}
            {os && (
              <Text style={detailItem}>
                <strong>Operating System:</strong> {os}
              </Text>
            )}
            {location && (
              <Text style={detailItem}>
                <strong>Location:</strong> {location}
              </Text>
            )}
            {details && (
              <Text style={detailItem}>
                <strong>Additional Details:</strong> {details}
              </Text>
            )}
          </Section>

          <Section style={actionSection}>
            <Text style={actionText}>{content.action}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This is an automated security notification from FTC FlowDeck.
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

const detailsSection = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '24px',
};

const detailsTitle = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const detailItem = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
};

const actionSection = {
  backgroundColor: '#fff4e6',
  borderLeft: '4px solid #f59e0b',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '16px 20px',
};

const actionText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '32px',
};
