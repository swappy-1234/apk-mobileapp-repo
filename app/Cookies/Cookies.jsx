import { View, Text , ScrollView } from "react-native";

import styles from '../../styles/Cookies/Cookies';

// list points ? 

const Cookies = () => {
    return (
      <ScrollView>
        <View style={styles.cookiesPolicy}>
            <View style={styles.cookiesPolicyInner}>
                <Text style={styles.h1}>Cookies Policy</Text>
                <Text style={styles.paragraph}>Last updated: December, 2025</Text>

                <Text style={styles.h2}>1. Introduction:</Text>
                <Text style={styles.paragraph}>This Cookie Policy explains how Yari Hive. (collectively referred to as “we”, “us”, or “our”) use cookies and similar tracking technologies on our websites, applications, and services (collectively, the “Services”).{"\n"}
          This Cookie Policy forms part of our broader commitment to protecting your privacy and complying with applicable data protection laws, including the<Text style={{ fontWeight: 'bold' }}> Digital Personal Data Protection Act, 2023 (India) and the UK General Data Protection Regulation (UK GDPR).</Text></Text>

          <Text style={styles.h2}>2. What are Cookies?</Text>
          <Text style={styles.paragraph}>
            Cookies are small text files that are placed on your device (such as a computer, smartphone, or other internet-enabled device) when you visit a website or use an application. They help us recognize your device, store your preferences, enhance your browsing experience, and support the secure and efficient operation of our Services.{"\n"}
          We may also use similar tracking technologies, such as local storage objects (LSOs) and pixel tags, where applicable, for similar purposes as described in this Policy.
          </Text>
          
          <Text style={styles.h2}>3. Types of Cookies We Use:</Text>
          <Text style={styles.paragraph}>
            We use the following types of cookies on our Services:
          </Text>
          <Text style={styles.h3}>3.1	 Essential Cookies:</Text>
          <Text style={styles.paragraph}>These cookies are strictly necessary for the operation of our Services. They enable core functionalities such as secure login sessions, user authentication, session management, and the preservation of essential user preferences. Without these cookies, certain features of our Services may not function properly or securely.</Text>
          <Text style={styles.h3}>3.2	 Performance and Analytics Cookies:</Text>
          <Text style={styles.paragraph}>
            These cookies collect information about how visitors interact with our Services, including pages visited, time spent on pages, navigation patterns, and error reports. This data helps us analyse usage trends and improve the performance, reliability, and usability of our Services. These cookies are designed to collect aggregated or anonymized information and do not intentionally collect directly identifiable Personal Data.
          </Text>
          <Text style={styles.h3}>3.3	 Functionality Cookies:</Text>
          <Text style={styles.paragraph}>These cookies enable enhanced functionality and personalization, such as language preferences or time zone settings. They may be set by us or by third-party providers whose services we have integrated.</Text>
        <Text style={styles.h3}>3.4	 Third-Party Cookies:</Text>
        <Text style={styles.paragraph}>We may permit certain third-party service providers—such as analytics, advertising, or social media platforms—to place cookies or similar technologies on your device in order to deliver their services. These third parties operate under their own privacy and cookie policies, and we encourage you to review those policies to understand how they collect, use, and protect your information.</Text>

        <Text style={styles.h2}>4. How We Use Cookies:</Text>
        <Text style={styles.paragraph}>We use cookies and similar technologies to: </Text>
          <View style={styles.listContainer}>
          <Text style={styles.listItem}> a. Manage and secure your login sessions. </Text>
           <Text style={styles.listItem}>b. Remember your preferences and personalized settings. </Text>
           <Text style={styles.listItem}>c. Analyse usage patterns to improve the performance and functionality of our Services. </Text>
           <Text style={styles.listItem}>d. Detect, prevent, and respond to fraudulent or malicious activity. </Text>
           <Text style={styles.listItem}>e. Provide personalized content and communications where you have provided your consent, where required by law. </Text>
          </View>

          <Text style={styles.h2}>5. Your Cookie Choices:</Text>
          <Text style={styles.h3}>5.1  Consent Collection :</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>a. When you first visit our Services, a cookie consent pop-up will be displayed to you. </Text>
            <Text style={styles.listItem}>b. Explains the categories of cookies used on our Services. </Text>
             <Text style={styles.listItem}>c. Provides granular control over your preferences for non-essential cookies. </Text>
             <Text style={styles.listItem}>d. Seeks your explicit consent before any non-essential cookies are placed on your device, in
            accordance with applicable data protection laws. </Text>
          </View>
          <Text style={styles.h3}>5.2  Consent Records :</Text>
          <Text style={styles.paragraph}>We maintain secure records of all cookie consent actions for compliance and audit purposes. Each consent record includes:</Text>
          <View style={styles.listContainer}>
           <Text style={styles.listItem}>a. User ID or session ID, where applicable. </Text>
           <Text style={styles.listItem}>b. The consent status for each category of cookies. </Text>
           <Text style={styles.listItem}>c. The date and time (timestamp) of the consent action. </Text>
          </View>
          <Text style={styles.paragraph}> All consent records are stored securely for a period of six (6) months, unless a longer retention
          period is required by applicable law.</Text>
          <Text style={styles.h3}>5.3  Modifying or Withdrawing Consent  :</Text>
          <Text style={styles.paragraph}> You may change or withdraw your cookie consent at any time using one of the following methods:</Text>
          <View style={styles.listContainer}>
           <Text style={styles.listItem}>a. Through the cookie consent banner, which can be re-accessed via the website footer.  </Text>
           <Text style={styles.listItem}>b. Through your account settings, where applicable and if you are logged in. </Text>
          </View>
          <Text style={styles.paragraph}> Please note that withdrawal of consent will apply only to future cookie usage. Any data collected
          prior to the withdrawal of consent will continue to be processed lawfully in accordance with
          applicable data protection laws.</Text>
          <Text style={styles.h3}>5.4  Periodic Renewal :</Text>
          <Text style={styles.paragraph}>We will prompt you to renew your cookie consent periodically and whenever there is a material
          change in our cookie practices, to ensure that your preferences remain current and compliant with
          applicable data protection laws.</Text>

          <Text style={styles.h2}>6. Managing Cookies Through Your Browser: </Text>
          <Text style={styles.paragraph}>You may also manage or delete cookies through your web browser settings. Most modern
          browsers allow you to:</Text>
          <View style={styles.listContainer}>
           <Text style={styles.listItem}>a. View the cookies stored on your device. </Text>
           <Text style={styles.listItem}>b. Delete existing cookies. </Text>
           <Text style={styles.listItem}>c. Block or restrict cookies from specific websites. </Text>
          </View>
          <Text style={styles.paragraph}> Please refer to your browser’s help or support section for detailed instructions on managing cookie
          settings. Please note that disabling essential cookies may affect the core functionality, security, and
          performance of the Services.</Text>

          <Text style={styles.h2}>7. Cookie Duration:</Text>
          <Text style={styles.paragraph}>Cookies used on our Services may be either session cookies (which are deleted automatically when
          you close your browser) or persistent cookies (which remain on your device for a defined period).
          The duration for which a cookie remains active varies depending on its type, purpose, and
          applicable regulatory requirements.</Text>

          <Text style={styles.h2}>8. Third-Party Cookies and Data Transfers:</Text>
          <View style={styles.listContainer}> 
            <Text style={styles.listItem}>a. Some third-party cookies used on our Services may involve the transfer of data across national
            borders, for example, where analytics or service providers are based outside<Text style={{ fontWeight: 'bold' }}> India</Text> or the
            <Text style={{ fontWeight: 'bold' }}> United Kingdom.</Text> </Text>

             <Text style={styles.listItem}>b. All such cross-border data transfers are conducted in compliance with the <Text style={{ fontWeight: 'bold' }}> Digital Personal
              Data Protection Act, 2023 (India)</Text> and applicable<Text style={{ fontWeight: 'bold' }}> UK data protection laws,</Text>including the <Text style={{ fontWeight: 'bold' }}>UK
                GDPR.</Text> We carefully assess and vet all third-party service providers for privacy and security
            compliance and require appropriate <Text style={{ fontWeight: 'bold' }}>contractual, technical, and organizational safeguards</Text> to
            protect Personal Data. </Text>
            </View>

            <Text style={styles.h2}>9. Changes to This Cookie Policy:</Text>
            <Text style={styles.paragraph}>
              We may update this Cookie Policy from time to time to reflect changes in our practices,
          technologies, or legal and regulatory requirements. Where changes are material, we will notify you
          in advance by email or through a prominent notice on our Services before such changes take effect.
          We encourage you to review this Cookie Policy periodically to stay informed about how we use
          cookies and similar technologies.
            </Text>

            <Text style={styles.h2}>10. Contact Us:</Text>
            <Text style={styles.paragraph}>If you have any questions, concerns, or requests regarding our use of cookies or this Cookie Policy, please submit your inquiry via the Yari Hive Help Centre, and our team will respond to you.</Text>




       
            </View>
        </View>
        </ScrollView>
    )
};

export default Cookies;