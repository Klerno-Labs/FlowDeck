import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface ReminderEmailProps {
  subject: string;
  message?: string;
  productUrl?: string;
}

export function ReminderEmail({ subject, message, productUrl }: ReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reminder: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={logoContainer}>
            <div style={logoBox}>
              <span style={logoText}>FTC</span>
            </div>
          </div>

          <Heading style={h1}>Reminder</Heading>

          <Text style={text}>
            <strong>{subject}</strong>
          </Text>

          {message && (
            <Text style={text}>{message}</Text>
          )}

          {productUrl && (
            <div style={buttonContainer}>
              <Button href={productUrl} style={button}>
                View Product
              </Button>
            </div>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Filtration Technology Corporation
            <br />
            Revolutionary Filtration Technology
            <br />
            <Link href="https://ftc.com" style={link}>
              ftc.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logoBox = {
  display: 'inline-block',
  width: '80px',
  height: '80px',
  backgroundColor: '#1E5AA8',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoText = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 24px',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 24px',
  marginBottom: '16px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#1E5AA8',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '32px',
  padding: '0 24px',
  textAlign: 'center' as const,
};

const link = {
  color: '#1E5AA8',
  textDecoration: 'underline',
};
