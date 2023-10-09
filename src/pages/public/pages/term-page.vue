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
const title = 'Terms And Conditions Of Use'
const subTitles = [
  'Effective Date: January 8th, 2019',
  'Site Covered: atlas-os.org',
]
//computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

const teamContents: PublicItem[] = [
  {
    label: 'The Agreement',
    to: 'the-agreement',
    content: `The use of this website and services on this website provided by Shannon Genomics Inc (hereinafter referred to as "Company") are subject to the following Terms & Conditions (hereinafter the "Agreement"), all parts and sub-parts of which are specifically incorporated by reference here. This Agreement shall govern the use of all pages on this website (hereinafter collectively referred to as "Website") and any services provided by or on this Website ("Services").`,
  },
  {
    label: '1. Definitions',
    to: '1-definitions',
    content: `The parties referred to in this Agreement shall be defined as follows:
  <br/>
  a) Company, Us, We: The Company, as the creator, operator, and publisher of the Website, makes the Website, and certain Services on it, available to users. Shannon Genomics Inc, Company, Us, We, Our, Ours and other first-person pronouns will refer to the Company, as well as all employees and affiliates of the Company.
  <br/>
  b) You, the User, the Client: You, as the user of the Website, will be referred to throughout this Agreement with second-person pronouns such as You, Your, Yours, or as User or Client.
  <br/>
  c) Parties: Collectively, the parties to this Agreement (the Company and You) will be referred to as Parties.
`,
  },
  {
    label: '2. Assent & Acceptance',
    to: '2-assent-acceptance',
    content: `By using the Website, You warrant that You have read and reviewed this Agreement and that You agree to be bound by it. If You do not agree to be bound by this Agreement, please leave the Website immediately. The Company only agrees to provide use of this Website and Services to You if You assent to this Agreement.`,
  },
  {
    label: '3. Age Restriction',
    to: '3-age-restriction',
    content: `You must be at least 18 (eighteen) years of age to use this Website or any Services contained herein. By using this Website, You represent and warrant that You are at least 18 years of age and may legally agree to this Agreement. The Company assumes no responsibility or liability for any misrepresentation of Your age.`,
  },
  {
    label: '4. License To Use Website',
    to: '4-license-to-use-website',
    content: `The Company may provide You with certain information as a result of Your use of the Website or Services. Such information may include, but is not limited to, documentation, data, or information developed by the Company, and other materials which may assist in Your use of the Website or Services ("Company Materials"). Subject to this Agreement, the Company grants You a non-exclusive, limited, non-transferable and revocable license to use the Company Materials solely in connection with Your use of the Website and Services. The Company Materials may not be used for any other purpose, and this license terminates upon Your cessation of use of the Website or Services or at the termination of this Agreement.`,
  },
  {
    label: '5. Intellectual Property',
    to: '5-intellectual-property',
    content: `You agree that the Website and all Services provided by the Company are the property of the Company, including all copyrights, trademarks, trade secrets, patents, and other intellectual property ("Company IP"). You agree that the Company owns all right, title and interest in and to the Company IP and that You will not use the Company IP for any unlawful or infringing purpose. You agree not to reproduce or distribute the Company IP in any way, including electronically or via registration of any new trademarks, trade names, service marks or Uniform Resource Locators (URLs), without express written permission from the Company.
  <br/>
  a) In order to make the Website and Services available to You, You hereby grant the Company a royalty-free, non-exclusive, worldwide license to copy, display, use, broadcast, transmit and make derivative works of any content You publish, upload, or otherwise make available to the Website ("Your Content"). The Company claims no further proprietary rights in Your Content.
  <br/>
  b) If You feel that any of Your intellectual property rights have been infringed or otherwise violated by the posting of information or media by another of Our users, please contact Us and let Us know.`,
  },
  {
    label: '6. User Obligations',
    to: '6-user-obligations',
    content: `As a user of the Website or Services, You may be asked to register with Us. When You do so, You will choose a user identifier, which may be Your email address or another term, as well as a password. You may also provide personal information, including, but not limited to, Your name. You are responsible for ensuring the accuracy of this information. This identifying information will enable You to use the Website and Services. You must not share such identifying information with any third party, and if You discover that Your identifying information has been compromised, You agree to notify Us immediately in writing. Email notification will suffice. You are responsible for maintaining the safety and security of Your identifying information as well as keeping Us apprised of any changes to Your identifying information. Providing false or inaccurate information, or using the Website or Services to further fraud or unlawful activity is grounds for immediate termination of this Agreement.`,
  },
  {
    label: '7. Acceptable Use',
    to: '7-acceptable-use',
    content: `You agree not to use the Website or Services for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Website or Services in any way that could damage the Website, Services, or general business of the Company.
  <br/>
  a) You further agree not to use the Website or Services:
  <br/>
  I) To harass, abuse, or threaten others or otherwise violate any person's legal rights;
  <br/>
  II) To violate any intellectual property rights of the Company or any third party;
  <br/>
  III) To upload or otherwise disseminate any computer viruses or other software that may damage the property of another;
  <br/>
  IV) To perpetrate any fraud;
  <br/>
  V) To engage in or create any unlawful gambling, sweepstakes, or pyramid scheme;
  <br/>
  VI) To publish or distribute any obscene or defamatory material;
  <br/>
  VII) To publish or distribute any material that incites violence, hate, or discrimination towards any group;
  <br/>
  VIII) To unlawfully gather information about others.
  `,
  },
  {
    label: '8. Affiliate Marketing & Advertising',
    to: '8-affiliate-marketing-advertising',
    content: `The Company, through the Website and Services, may engage in affiliate marketing whereby the Company receives a commission on or percentage of the sale of goods or services on or through the Website. The Company may also accept advertising and sponsorships from commercial businesses or receive other forms of advertising compensation. This disclosure is intended to comply with the US Federal Trade Commission Rules on marketing and advertising, as well as any other legal requirements which may apply.`,
  },
  {
    label: '9. Privacy Information',
    to: '9-privacy-information',
    content: `
  Through Your Use of the Website and Services, You may provide Us with certain information. By using the Website or the Services, You authorize the Company to use Your information in the United States and any other country where We may operate.
  <br/>
  a) Information We May Collect or Receive: When You register for an account, You provide Us with a valid email address and may provide Us with additional information, such as Your name or billing information. Depending on how You use Our Website or Services, We may also receive information from external applications that You use to access Our Website, or We may receive information through various web technologies, such as cookies, log files, clear gifs, web beacons or others.
  <br/>
  b) How We Use Information: We use the information gathered from You to ensure Your continued good experience on Our website, including through email communication. We may also track certain aspects of the passive information received to improve Our marketing and analytics, and for this, We may work with third-party providers.
  <br/>
  c) How You Can Protect Your Information: If You would like to disable Our access to any passive information We receive from the use of various technologies, You may choose to disable cookies in Your web browser. Please be aware that the Company will still receive information about You that You have provided, such as Your email address. If You choose to terminate Your account, the Company will store information about You for the following number of days: 1,825. After that time, it will be deleted.`,
  },
  {
    label: '10. Sale Of Goods/Services',
    to: '10-sale-of-goods-services',
    content: `
  The Company may sell goods or services or allow third parties to sell goods or services on the Website. The Company undertakes to be as accurate as possible with all information regarding the goods and services, including product descriptions and images. However, the Company does not guarantee the accuracy or reliability of any product information, and You acknowledge and agree that You purchase such products at Your own risk. For goods or services sold by others, the Company assumes no liability for any product and cannot make any warranties about the merchantability, fitness, quality, safety or legality of these products. For any claim You may have against the manufacturer or seller of the product, You agree to pursue that claim directly with the manufacturer or seller and not with the Company. You hereby release the Company from any claims related to goods or services manufactured or sold by third parties, including any and all warranty or product liability claims.
  <br/>
  If You are unhappy with a service being sold on Our Website, You may request a refund.`,
  },
  {
    label: '11. Reverse Engineering & Security',
    to: '11-reverse-engineering-security',
    content: `
  You agree not to undertake any of the following actions:
  <br/>
  a) Reverse engineer, or attempt to reverse engineer or disassemble any code or software from or on the Website or Services;
  <br/>
  b) Violate the security of the Website or Services through any unauthorized access, circumvention of encryption or other security tools, data mining or interference to any host, user or network.`,
  },
  {
    label: '12. Data Loss',
    to: '12-data-loss',
    content: `The Company does not accept responsibility for the security of Your account or content. You agree that Your use of the Website or Services is at Your own risk.`,
  },
  {
    label: '13. Indemnification',
    to: '13-indemnification',
    content: `You agree to defend and indemnify the Company and any of its affiliates (if applicable) and hold Us harmless against any and all legal claims and demands, including reasonable attorney's fees, which may arise from or relate to Your use or misuse of the Website or Services, Your breach of this Agreement, or Your conduct or actions. You agree that the Company shall be able to select its own legal counsel and may participate in its own defense, if the Company wishes.`,
  },
  {
    label: '14. Spam Policy',
    to: '14-spam-policy',
    content: `You are strictly prohibited from using the Website or any of the Company's Services for illegal spam activities, including gathering email addresses and personal information from others or sending any mass commercial emails.
`,
  },
  {
    label: '15. Third-Party Links & Content',
    to: '15-third-party-links-content',
    content: `The Company may occasionally post links to third party websites or other services. You agree that the Company is not responsible or liable for any loss or damage caused as a result of Your use of any third party services linked to from Our Website.
`,
  },
  {
    label: '16. Modification & Variation',
    to: '16-modification-variation',
    content: `
  The Company may, from time to time and at any time without notice to You, modify this Agreement. You agree that the Company has the right to modify this Agreement or revise anything contained herein. You further agree that all modifications to this Agreement are in full force and effect immediately upon posting on the Website and that modifications or variations will replace any prior version of this Agreement, unless prior versions are specifically referred to or incorporated into the latest modification or variation of this Agreement.
  <br/>
  a) To the extent any part or sub-part of this Agreement is held ineffective or invalid by any court of law, You agree that the prior, effective version of this Agreement shall be considered enforceable and valid to the fullest extent.
  <br/>
  b) You agree to routinely monitor this Agreement and refer to the Effective Date posted at the top of this Agreement to note modifications or variations. You further agree to clear Your cache when doing so to avoid accessing a prior version of this Agreement. You agree that Your continued use of the Website after any modifications to this Agreement is a manifestation of Your continued assent to this Agreement.
  <br/>
  c) In the event that You fail to monitor any modifications to or variations of this Agreement, You agree that such failure shall be considered an affirmative waiver of Your right to review the modified Agreement.`,
  },
  {
    label: '17. Entire Agreement',
    to: '17-entire-agreement',
    content: `This Agreement constitutes the entire understanding between the Parties with respect to any and all use of this Website. This Agreement supersedes and replaces all prior or contemporaneous agreements or understandings, written or oral, regarding the use of this Website.
`,
  },
  {
    label: '18. Service Interruptions',
    to: '18-service-interruptions',
    content: `The Company may need to interrupt Your access to the Website to perform maintenance or emergency services on a scheduled or unscheduled basis. You agree that Your access to the Website may be affected by unanticipated or unscheduled downtime, for any reason, but that the Company shall have no liability for any damage or loss caused as a result of such downtime.`,
  },
  {
    label: '19. Term, Termination & Suspension',
    to: '19-term-termination-suspension',
    content: `The Company may terminate this Agreement with You at any time for any reason, with or without cause. The Company specifically reserves the right to terminate this Agreement if You violate any of the terms outlined herein, including, but not limited to, violating the intellectual property rights of the Company or a third party, failing to comply with applicable laws or other legal obligations, and/or publishing or distributing illegal material. If You have registered for an account with Us, You may also terminate this Agreement at any time by contacting Us and requesting termination. At the termination of this Agreement, any provisions that would be expected to survive termination by their nature shall remain in full force and effect.`,
  },
  {
    label: '20. No Warranties',
    to: '20-no-warranties',
    content: `You agree that Your use of the Website and Services is at Your sole and exclusive risk and that any Services provided by Us are on an "As Is" basis. The Company hereby expressly disclaims any and all express or implied warranties of any kind, including, but not limited to the implied warranty of fitness for a particular purpose and the implied warranty of merchantability. The Company makes no warranties that the Website or Services will meet Your needs or that the Website or Services will be uninterrupted, error-free, or secure. The Company also makes no warranties as to the reliability or accuracy of any information on the Website or obtained through the Services. You agree that any damage that may occur to You, through Your computer system, or as a result of loss of Your data from Your use of the Website or Services is Your sole responsibility and that the Company is not liable for any such damage or loss.`,
  },
  {
    label: '21. Limitation On Liability',
    to: '21-limitation-on-liability',
    content: `The Company is not liable for any damages that may occur to You as a result of Your use of the Website or Services, to the fullest extent permitted by law. The maximum liability of the Company arising from or relating to this Agreement is limited to the greater of one hundred ($100) US Dollars or the amount You paid to the Company in the last six (6) months. This section applies to any and all claims by You, including, but not limited to, lost profits or revenues, consequential or punitive damages, negligence, strict liability, fraud, or torts of any kind.
`,
  },
  {
    label: '22. General Provisions',
    to: '22-general-provisions',
    content: `a) LANGUAGE: All communications made or notices given pursuant to this Agreement shall be in the English language.
  <br/>
  b) JURISDICTION, VENUE & CHOICE OF LAW: Through Your use of the Website or Services, You agree that the laws of the State of New Jersey shall govern any matter or dispute relating to or arising out of this Agreement, as well as any dispute of any kind that may arise between You and the Company, with the exception of its conflict of law provisions. In case any litigation specifically permitted under this Agreement is initiated, the Parties agree to submit to the personal jurisdiction of the state and federal courts of the following county: Union county, New Jersey. The Parties agree that this choice of law, venue, and jurisdiction provision is not permissive, but rather mandatory in nature. You hereby waive the right to any objection of venue, including assertion of the doctrine of forum non conveniens or similar doctrine.
  <br/>
  c) ARBITRATION: In case of a dispute between the Parties relating to or arising out of this Agreement, the Parties shall first attempt to resolve the dispute personally and in good faith. If these personal resolution attempts fail, the Parties shall then submit the dispute to binding arbitration. The arbitration shall be conducted in the following county: Union county. The arbitration shall be conducted by a single arbitrator, and such arbitrator shall have no authority to add Parties, vary the provisions of this Agreement, award punitive damages, or certify a class. The arbitrator shall be bound by applicable and governing Federal law as well as the law of the following state: New Jersey. Each Party shall pay their own costs and fees. Claims necessitating arbitration under this section include, but are not limited to: contract claims, tort claims, claims based on Federal and state law, and claims based on local laws, ordinances, statutes or regulations. Intellectual property claims by the Company will not be subject to arbitration and may, as an exception to this sub-part, be litigated. The Parties, in agreement with this sub-part of this Agreement, waive any rights they may have to a jury trial in regard to arbitral claims.
  <br/>
  d) ASSIGNMENT: This Agreement, or the rights granted hereunder, may not be assigned, sold, leased or otherwise transferred in whole or part by You. Should this Agreement, or the rights granted hereunder, by assigned, sold, leased or otherwise transferred by the Company, the rights and liabilities of the Company will bind and inure to any assignees, administrators, successors, and executors.
  <br/>
  e) SEVERABILITY: If any part or sub-part of this Agreement is held invalid or unenforceable by a court of law or competent arbitrator, the remaining parts and sub-parts will be enforced to the maximum extent possible. In such condition, the remainder of this Agreement shall continue in full force.
  <br/>
  f) NO WAIVER: In the event that We fail to enforce any provision of this Agreement, this shall not constitute a waiver of any future enforcement of that provision or of any other provision. Waiver of any part or sub-part of this Agreement will not constitute a waiver of any other part or sub-part.
  <br/>
  g) HEADINGS FOR CONVENIENCE ONLY: Headings of parts and sub-parts under this Agreement are for convenience and organization, only. Headings shall not affect the meaning of any provisions of this Agreement.
  <br/>
  h) NO AGENCY, PARTNERSHIP OR JOINT VENTURE: No agency, partnership, or joint venture has been created between the Parties as a result of this Agreement. No Party has any authority to bind the other to third parties.
  <br/>
  i) FORCE MAJEURE: The Company is not liable for any failure to perform due to causes beyond its reasonable control including, but not limited to, acts of God, acts of civil authorities, acts of military authorities, riots, embargoes, acts of nature and natural disasters, and other acts which may be due to unforeseen circumstances.
  <br/>
  j) ELECTRONIC COMMUNICATIONS PERMITTED: Electronic communications are permitted to both Parties under this Agreement, including e-mail or fax. For any questions or concerns, please email Us at the following address: support@atlas-os.org.`,
  },
]
</script>
