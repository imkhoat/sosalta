<template>
  <div class="entries-page full-width column q-pt-xl">
    <div
      class="col-12"
      :class="{ 'q-px-md': isMobile, 'q-px-xl': !isMobile }"
    >
      <h2 class="text-positive text-weight-bold text-h4 q-my-none q-pb-md">
        {{ title }}
      </h2>
      <div
        class="column justify-start items-start text-caption text-disable q-pl-sm"
      >
        <template v-if="subTitles">
          <span
            v-for="(sub, subIndex) in subTitles"
            :key="subIndex + '__content-box-sub-title'"
            >{{ sub }}</span
          >
        </template>
      </div>
    </div>
    <div
      class="row justify-between items-stretch"
      :class="{ 'column reverse': isMobile, 'q-px-xl': !isMobile }"
    >
      <div class="left-side col-12 col-md-8 q-px-xs">
        <content-box :items="teamContents"></content-box>
      </div>
      <div
        class="right-side col-12 col-md-4"
        :class="{ 'q-px-md': isMobile, 'q-px-xs': !isMobile }"
      >
        <table-of-content :items="teamContents"></table-of-content>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { PublicItem } from 'src/core/types/public-item-types'
import ContentBox from 'src/pages/public/components/content-box.vue'
import TableOfContent from 'src/pages/public/components/table-of-content.vue'
import { computed } from 'vue'

const $q = useQuasar()

// data
const title = 'Privacy Policy For Website'
const subTitles = [
  'Effective Date: January 8th, 2019',
  'Applicable To The Following Website:atlas-os.org',
]
//computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

const teamContents: PublicItem[] = [
  {
    label: 'Article 1 - Definitions',
    to: 'article-1',
    content: `a) APPLICABLE WEBSITE: This Privacy Policy will refer to and be applicable to the Website listed above, which shall hereinafter be referred to as "Website." Any listed Website may also refer to a corresponding mobile application, should one be currently in use or hereinafter developed.
  <br/>
  b) EFFECTIVE DATE: "Effective Date" means the date this Privacy Policy comes into force and effect.
  <br/>
  c) PARTIES: The parties to this privacy policy are the following data controller: Shannon Genomics Inc ("Data Controller") and you, as the user of this Website. Hereinafter, the parties will individually be referred to as "Party" and collectively as "Parties".
  <br/>
  d) DATA CONTROLLER: Data Controller is the publisher, owner, and operator of the Website and is the Party responsible for the collection of information described herein. Data Controller shall be referred to either by Data Controller's name or "Data Controller," as listed above. If Data Controller or Data Controller's property shall be referred to through first-person pronouns, it shall be through the use of the following: us, we, our, ours, etc.
  <br/>
  e) YOU: Should you agree to this Privacy Policy and continue your use of the Website, you will be referred to herein as either you, the user, or if any second-person pronouns are required and applicable, such pronouns as 'your", "yours", etc.
  <br/>
  f) SERVICES: "Services" means any services that we make available for sale on the Website.
  <br/>
  g) PERSONAL DATA: "Personal DATA" means personal data and information that we obtain from you in connection with your use of the Website which is capable of identifying you in any manner.`,
  },
  {
    label: 'Article 2 - General Information',
    to: 'article-2',
    content: `This privacy policy (hereinafter "Privacy Policy") describes how we collect and use the Personal Data that we receive about you, as well as your rights in relation to that Personal Data, when you visit our Website or use our Services.
  <br/>
  This Privacy Policy does not cover any information that we may receive about you through sources other than the use of our Website. The Website may link out to other websites or mobile applications, but this Privacy Policy does not and will not apply to any of those linked websites or applications.
  <br/>
  We are committed to the protection of your privacy while you use our Website.
  <br/>
  By continuing to use our Website, you acknowledge that you have had the chance to review and consider this Privacy Policy, and you acknowledge that you agree to it. This means that you also consent to the use of your information and the method of disclosure as described in this Privacy Policy. If you do not understand the Privacy Policy or do not agree to it then you agree to immediately cease your use of our Website.`,
  },
  {
    label: 'Article 3 -Contact And Data Protection Officer',
    to: 'article-3',
    content: `The Party responsible for the processing of your personal data is as follows: Shannon Genomics Inc. The Data Controller may be contacted as follows:
  <br/>
  Shannon Genomics Inc.
  <ul>
    <li>
    786 Mountain Blvd,
    </li>
    <li>
    Suite 204
    </li>
    <li>
    Watchung, NJ 07069
    </li>
  </ul>
<br/>
  The Data Controller and operator of the Website are one and the same.
  <br/>
  The Data Protection Officer may be contacted as follows:`,
  },
  {
    label: 'Article 4 - Location',
    to: 'article-4',
    content: `
  Please be advised the data processing activities take place in the United States, outside the European Economic Area. Data may also be transferred to companies within the United States, but will only be done so in a manner that complies with the EU's General Data Protection Regulation or GDPR. The location where the data processing activities take place is as follows:
  <br/>
  Amazon Web Services (AWS) Data Centers`,
  },
  {
    label: 'Article 5 - Modifications And Revisions',
    to: 'article-5',
    content: `We reserve the right to modify, revise, or otherwise amend this Privacy Policy at any time and in any manner. If we do so, however, we will notify you and obtain your consent to the change in processing. Unless we specifically obtain your consent, any changes to the Privacy Policy will only impact the information collected on or after the date of the change. It is also your responsibility to periodically check this page for any such modification, revision or amendment.
`,
  },
  {
    label: 'Article 6 - The Personal Data We Receive From You',
    to: 'article-6',
    content: `Depending on how you use our Website, you will be subject to different types of Personal Data collected and different manners of collection:
  <br/>
  a) Registered users: You, as a user of the Website, may be asked to register in order to use the Website or to purchase the Services available for sale.
During the process of your registration, we will collect some of the following Personal Data from you through your voluntary disclosure:
  <ul>
    <li>
      Name
    </li>
    <li>
      E-mail
    </li>
    <li>
      Phone number
    </li>
  </ul>
Personal Data may be asked for in relation to:
  <br/>
  I) Interaction with our representatives in any way
  <br/>
  II) making purchases
  <br/>
  III) receiving general emails from us
  <br/>
  IV) commenting on our content or other user-generated content on our Website, such as blogs, articles, photographs or videos, or participating in our forums, bulletin boards, chat rooms or other similar features
  <br/>
  V) Or the following other forms of participation:
Users can upload scientific and research data to Atlas OS and run data analysis applications.
By undergoing the registration process, you consent to us collecting your Personal Data, including the Personal Data described in this clause, as well as storing, using or disclosing your Personal Data in accordance with this Privacy Policy.
  <br/>
  b) Unregistered users: If you are a passive user of the Website and do not register for any purchases or other service, you may still be subject to certain passive data collection ("Passive Data Collection"). Such Passive Data Collection may include through cookies, as described below, IP address information, location information, and certain browser data, such as history and/or session information.
  <br/>
  c) All users: The Passive Data Collection which applies to Unregistered users shall also apply to all other users and/or visitors of our Website.
  <br/>
  d) Sales & Billing Information: In order to purchase any of the services on the Website, you will be asked to provide certain credit information, billing address information, and possibly additional specific information so that you may be properly charged for your purchases. This payment and billing information may be stored for the following period: 3 years. If so, it will be used exclusively to assist you with making future purchases with us.
  <br/>
  e) Related Entities: We may share your Personal Data, including Personal Data that identifies you personally, with any of our parent companies, subsidiary companies, affiliates or other trusted related entities.
However, we only share your Personal Data with a trusted related entity if that entity agrees to our privacy standards as set out in this Privacy Policy and to treat your Personal Data in the same manner that we do.
  <br/>
  f) User Experience: From time to time we may request information from you to assist us in improving our Website, and the Services we sell, such as demographic information or your particular preferences.
  <br/>
  g) Content Interaction: Our Website may allow you to comment on the content that we provide or the content that other users provide, such as blogs, multimedia, or forum posts. If so, we may collect some Personal Data from you at that time, such as, but not limited to, username or email address.
  <br/>
  h) Combined or Aggregated Information: We may combine or aggregate some of your Personal Data in order to better serve you and to better enhance and update our Website for your and other consumers' use.
We may also share such aggregated information with others, but only if that aggregated information does not contain any Personal Data.
  <br/>
  i) Other Information: In addition to collecting the Personal Data as already described herein, we may also collect the following Personal Data:
Information regarding the nature of the user's scientific and research data sets, solely used by the users for their own data analysis purposes on our system.`,
  },
  {
    label: 'Article 7 - The Personal Data We Receive Automatically',
    to: 'article-7',
    content: `
  Cookies: We may collect information from you through automatic tracking systems (such as information about your browsing preferences) as well as through information that you volunteer to us (such as information that you provide during a registration process or at other times while using the Website, as described above).
  <br/>
  For example, we use cookies to make your browsing experience easier and more intuitive: cookies are small strings of text used to store some information that may concern the user, his or her preferences or the device they are using to access the Internet (such as a computer, tablet, or mobile phone). Cookies are mainly used to adapt the operation of the site to your expectations, offering a more personalized browsing experience and memorizing the choices you made previously.
  <br/>
  A cookie consists of a reduced set of data transferred to your browser from a web server and it can only be read by the server that made the transfer. This is not executable code and does not transmit viruses.
  <br/>
  Cookies do not record or store any Personal Data. If you want, you can prevent the use of cookies, but then you may not be able to use our Website as we intend. To proceed without changing the options related to cookies, simply continue to use our Website.
  <br/>
  Technical cookies: Technical cookies, which can also sometimes be called HTML cookies, are used for navigation and to facilitate your access to and use of the site. They are necessary for the transmission of communications on the network or to supply services requested by you. The use of technical cookies allows the safe and efficient use of the site.
  <br/>
  You can manage or request the general deactivation or cancelation of cookies through your browser. If you do this though, please be advised this action might slow down or prevent access to some parts of the site.
  <br/>
  Cookies may also be retransmitted by an analytics or statistics provider to collect aggregated information on the number of users and how they visit the Website. These are also considered technical cookies when they operate as described.
  <br/>
  Temporary session cookies are deleted automatically at the end of the browsing session - these are mostly used to identify you and ensure that you don't have to log in each time - whereas permanent cookies remain active longer than just one particular session.
  <br/>
  Support in configuring your browser: You can manage cookie through the settings of your browser on your device. However, deleting cookies from your browser may remove the preferences you have set for this Website.
  <br/>
  For further information and support, you can also visit the specific help page of the web browser you are using:
  <ul>
    <li>
      Internet Explorer: <a target='_blank' href='http://windows.microsoft.com/en-us/windows-vista/block-or-allow-cookies'>http://windows.microsoft.com/en-us/windows-vista/block-or-allow-cookies</a>
    </li>
    <li>
      Firefox: <a target='_blank' href='https://support.mozilla.org/en-us/kb/enable-and-disable-cookies-website-preferences'>https://support.mozilla.org/en-us/kb/enable-and-disable-cookies-website-preferences</a>
    </li>
    <li>
      Safari: <a target='_blank' href='http://www.apple.com/legal/privacy'>http://www.apple.com/legal/privacy</a>
    </li>
    <li>
      Chrome: <a target='_blank' href='https://support.google.com/accounts/answer/61416?hl=en'>https://support.google.com/accounts/answer/61416?hl=en</a>
    </li>
    <li>
      Opera: <a target='_blank' href='http://www.opera.com/help/tutorials/security/cookies'>http://www.opera.com/help/tutorials/security/cookies</a>
    </li>
  </ul>
<br/>
  Log Data: Like all websites and mobile applications, this Website also makes use of log files which store automatic information collected during user visits. The different types of log data could be as follows:
  <ul>
    <li>
      internet protocol (IP) address;
    </li>
    <li>
      type of browser and device parameters used to connect to the Website;
    </li>
    <li>
      name of the Internet Service Provider (ISP);
    </li>
    <li>
      date and time of visit;
    </li>
    <li>
      web page of origin of the user (referral) and exit;
    </li>
    <li>
      possibly the number of clicks.
    </li>
  </ul>
<br/>
  The aforementioned information is processed in an automated form and collected in an exclusively aggregated manner in order to verify the correct functioning of the site, and for security reasons. This information will be processed according to the legitimate interests of the Data Controller.
  <br/>
  For security purposes (spam filters, firewalls, virus detection), the automatically recorded data may also possibly include Personal Data such as IP address, which could be used, in accordance with applicable laws, in order to block attempts at damage to the Website or damage to other users, or in the case of harmful activities or crime. Such data are never used for the identification or profiling of the user, but only for the protection of the Website and our users. Such information will be treated according to the legitimate interests of the Data Controller.`,
  },
  {
    label: 'Article 8 - Third Parties',
    to: 'article-8',
    content: `
  We may utilize third party service providers ("Third Party Service Providers"), from time to time or all the time, to help us with our Website, and to help serve you.
  <br/>
  We may use Third Party Service Providers to assist with information storage (such as cloud storage).
  <br/>
  We may use Third Party Service Providers to host the Website. In this instance, the Third Party Service Provider will have access to your Personal Data.
  <br/>
  We may use Third Party Service Providers to fulfill orders in relation to the Website.
  <br/>
  We may allow third parties to advertise on the Website. These third parties may use cookies in connection with their advertisements (see the "Cookies" clause in this Privacy Policy).
  <br/>
  We may use Third Party Service Providers for the following services in relation to the Website:
  <br/>
  The website uses Third Party analysis application developers to develop some of the data analysis applications on our website.
  <br/>
  Some of our Third Party Service Providers may be located outside of the United States and may not be subject to U.S. privacy laws. The countries or regions in which our Third Party Service Providers may be located include:
  <br/>
  China, India, and Canada.
  <br/>
  We only share your Personal Data with a Third Party Service Provider if that provider agrees to our privacy standards as set out in this Privacy Policy.
  <br/>
  Your Personal Data will not be sold or otherwise transferred to other third parties without your approval.
  <br/>
  Notwithstanding the other provisions of this Privacy Policy, we may provide your Personal Data to a third party or to third parties in order to protect the rights, property or safety, of us, our customers or third parties, or as otherwise required by law.
  <br/>
  We will not knowingly share your Personal Data with any third parties other than in accordance with this Privacy Policy.
  <br/>
  If your Personal Data might be provided to a third party in a manner which is other than as explained in this Privacy Policy, you will be notified. you will also have the opportunity to request that we not share that information.`,
  },
  {
    label: 'Article 9 - Social Network Plugins',
    to: 'article-9',
    content: `This Website incorporates plugins and/or buttons for social networks, in order to allow easy sharing of content on your favorite social networks. These plugins are programmed so as not to set any cookies when accessing the page, to safeguard the privacy of users. Cookies may be set, however, if you make voluntary use of the plugin. Please note that if you browse while being logged into the social network then you have already consented to the use of cookies conveyed through this Website at the time that you registered with the particular social network.
  <br/>
  The collection and use of information obtained by means of the plugin are governed by the respective privacy policies of the social networks, which can be found below:
  <ul>
    <li>
      Facebook: <a target='_blank' href='https://www.facebook.com/help/cookies'>https://www.facebook.com/help/cookies</a>
    </li>
    <li>
      Twitter: <a target='_blank' href='https://help.twitter.com/en/rules-and-policies/twitter-cookies'>https://help.twitter.com/en/rules-and-policies/twitter-cookies</a>
    </li>
    <li>
      Google+: <a target='_blank' href='http: //www.google.com/policies/technologies/cookies'>http: //www.google.com/policies/technologies/cookies</a>
    </li>
    <li>
      Pinterest: <a target='_blank' href='https://about.pinterest.com/it/privacy-policy'>https://about.pinterest.com/it/privacy-policy</a>
    </li>
    <li>
      AddThis: <a target='_blank' href='http://www.addthis.com/privacy/privacy-policy'>http://www.addthis.com/privacy/privacy-policy</a>
    </li>
    <li>
      Linkedin: <a target='_blank' href='https://www.linkedin.com/legal/cookie-policy'>https://www.linkedin.com/legal/cookie-policy</a>
    </li>
  </ul>`,
  },
  {
    label: 'Article 10 - How Personal Data Is Stored',
    to: 'article-10',
    content: `
  We use secure physical and digital systems to store your Personal Data when appropriate. We ensure that your Personal Data is protected against unauthorized access, disclosure, or destructions.
  <br/>
  Please note, however, that no system involving the transmission of information via the internet, or the electronic storage of data, is completely secure. However, we take the protection and storage of your Personal Data very seriously. We take all reasonable steps to protect your Personal Data.
  <br/>
  Personal Data is stored throughout your relationship with us. We delete your Personal Data upon request for cancelation of your account or other general request for the deletion of data.
  <br/>
  In the event of a breach of your Personal Data, you will be notified in a reasonable time frame, but in no event later than two weeks, and we will follow all applicable laws regarding such breach.`,
  },
  {
    label: 'Article 11 - Purposes Of Processing Of Personal Data',
    to: 'article-11',
    content: `
  We primarily use your Personal Data to help us provide a better experience for you on our Website and to provide you the services and/or information you may have requested, such as use of our Website.
  <br/>
  Information that does not identify you personally, but that may assist in providing us broad overviews of our customer base, will be used for market research or marketing efforts. Such information may include, but is not limited to, interests based on your cookies.
  <br/>
  Personal Data that may be considering identifying may be used for the following:
  <br/>
  a) Improving your personal user experience
  <br/>
  b) Communicating with you about your user account with us
  <br/>
  c) Fulfilling your purchases
  <br/>
  d) Providing customer service to you`,
  },
  {
    label: 'Article 12 - Disclosure Of Personal Data',
    to: 'article-12',
    content: `Although our policy is to maintain the privacy of your Personal Data as described herein, we may disclose your Personal Data if we believe that it is reasonable to do so in certain cases, in our sole and exclusive discretion. Such cases may include, but are not limited to:
  <br/>
  a) To satisfy any local, state, or Federal laws or regulations
  <br/>
  b) To respond to requests, such discovery, criminal, civil, or administrative process, subpoenas, court orders, or writs from law enforcement or other governmental or legal bodies
  <br/>
  c) To bring legal action against a user who has violated the law or violated the terms of use of our Website
  <br/>
  d) As may be necessary for the operation of our Website
  <br/>
  e) To generally cooperate with any lawful investigation about our users
  <br/>
  f) If we suspect any fraudulent activity on our Website or if we have noticed any activity which may violate our terms or other applicable rules`,
  },
  {
    label: 'Article 13 - Public Information',
    to: 'article-13',
    content: `We may allow users to post their own content or information publicly on our Website. Such content or information may include, but is not limited to, photographs, status updates, blogs, articles, or other personal snippets. Please be aware that any such information or content that you may post should be considered entirely public and that we do not purport to maintain the privacy of such public information.
`,
  },
  {
    label: 'Article 14 - Opting Out Of Transmittals From Us',
    to: 'article-14',
    content: `From time to time, we may send you informational or marketing communications related to our Website such as announcements or other information. If you wish to opt-out of such communications, you may contact the following email: support@atlas-os.org. You may also click the opt-out link which will be provided at the bottom of any and all such communications.
  <br/>
  Please be advised that even though you may opt-out of such communications, you may still receive information from us that is specifically about your use of our Website or about your account with us.
  <br/>
  By providing any Personal Data to us, or by using our Website in any manner, you have created a commercial relationship with us. As such, you agree that any email sent from us or third-party affiliates, even unsolicited email, shall specifically not be considered SPAM, as that term is legally defined.`,
  },
  {
    label: 'Article 15 - Modifying, Deleting, And Accessing Your Information',
    to: 'article-15',
    content: `If you wish to modify or delete any information we may have about you, or you wish to simply access any information we have about you, you may do so from your account settings page.`,
  },
  {
    label: 'Article 16 - Acceptance Of Risk',
    to: 'article-16',
    content: `By continuing to our Website in any manner, use the Product, you manifest your continuing asset to this Privacy Policy. You further acknowledge, agree and accept that no transmission of information or data via the internet is not always completely secure, no matter what steps are taken. You acknowledge, agree and accept that we do not guarantee or warrant the security of any information that you provide to us, and that you transmit such information at your own risk.`,
  },
  {
    label: 'Article 17 - Your Rights',
    to: 'article-17',
    content: `You have many rights in relation to your Personal Data. Specifically, your rights are as follows:
  <ul>
    <li>
      the right to be informed about the processing of your Personal Data
    </li>
    <li>
    </li>
    <li>
      the right to have access to your Personal Data
    </li>
    <li>
      the right to update and/or correct your Personal Data
    </li>
    <li>
      the right to portability of your Personal Data
    </li>
    <li>
      the right to oppose or limit the processing of your Personal Data
    </li>
    <li>
      the right to request that we stop processing and delete your Personal Data
    </li>
    <li>
      the right to block any Personal Data processing in violation of any applicable law
    </li>
    <li>
      the right to launch a complaint with the Federal Trade Commission (FTC) in the United States or applicable data protection authority in another jurisdiction
    </li>
  </ul>
Such rights can all be exercised by contacting us at the relevant contact information listed in this Privacy Policy.`,
  },
  {
    label: 'Article 18 - Contact Information',
    to: 'article-18',
    content: `If you have any questions about this Privacy Policy or the way we collect information from you, or if you would like to launch a complaint about anything related to this Privacy Policy, you may contact us at the following email address: support@atlas-os.org.`,
  },
]
</script>
