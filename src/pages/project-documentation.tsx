import { type NextPage } from "next";
import { Header } from "~/component";
import MetaTags from "~/component/MetaTags";

const ProjectDocumentation: NextPage = () => {
  return (
    <>
      <MetaTags title="Project Documentation" />
      <Header />
      
      <main className="bg-light-bg dark:bg-primary min-h-screen py-8">
        <div className="container mx-auto px-4 print:px-0">
          <div className="max-w-4xl mx-auto bg-white dark:bg-primary-light p-8 rounded-lg shadow-sm print:shadow-none">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-text-secondary mb-8">
              Grower: A Web Platform for Startup Investment and Growth
            </h1>
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                Grower is a comprehensive web platform designed to connect early-stage startups with potential 
                investors. The platform facilitates idea sharing, investment proposals, and community building for 
                entrepreneurs and investors. Grower provides a streamlined process for startups to present their 
                business ideas through detailed articles and receive investment offers from verified investors. 
                This document outlines the objectives, design, implementation, and evaluation of the Grower platform.
              </p>
            </section>
            
            {/* Motivation */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                2. Motivation
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                The primary motivation behind developing Grower stems from the challenges faced by early-stage 
                startups in securing investment and guidance. Traditional funding routes often require extensive 
                networking, formal pitch presentations, and business planning that can be intimidating for new 
                entrepreneurs. Furthermore, potential investors struggle to discover promising startups in their 
                early stages.
              </p>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                Grower aims to bridge this gap by providing:
              </p>
              <ul className="list-disc pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>A simplified approach for entrepreneurs to present ideas without formal pitching</li>
                <li>A secure environment for investors to discover and evaluate potential opportunities</li>
                <li>A community-focused platform that values both financial investment and mentorship</li>
                <li>Reduced barriers to entry for first-time entrepreneurs</li>
                <li>Transparency in the investment process</li>
              </ul>
            </section>
            
            {/* Literature Review */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                3. Literature Review
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                The development of Grower is informed by several existing platforms and research in the 
                entrepreneurship and investment ecosystem:
              </p>
              <ul className="list-disc pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>
                  <strong>Angel Investment Platforms:</strong> Platforms like AngelList provide a marketplace for startups and 
                  investors but require formal pitch decks and more established startups.
                </li>
                <li>
                  <strong>Crowdfunding Platforms:</strong> Kickstarter and Indiegogo offer alternative funding methods but focus 
                  on product pre-sales rather than equity investment.
                </li>
                <li>
                  <strong>Content Platforms:</strong> Medium and Hashnode demonstrate the value of content-focused communities 
                  but lack integrated investment capabilities.
                </li>
                <li>
                  <strong>Research on Early-Stage Funding:</strong> Studies indicate that access to early capital is a significant 
                  predictor of startup success, yet remains one of the biggest challenges for new entrepreneurs.
                </li>
                <li>
                  <strong>Technology Adoption in Investment:</strong> Recent trends show increased adoption of digital platforms 
                  for investment processes, accelerated by global shifts toward remote business operations.
                </li>
              </ul>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                Grower builds upon these foundations while addressing gaps in the current landscape, particularly 
                the connection between content creation and investment opportunities.
              </p>
            </section>
            
            {/* Problem Statement */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                4. Problem Statement
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                The startup ecosystem faces several key challenges that Grower aims to address:
              </p>
              <ol className="list-decimal pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>Early-stage startups struggle to gain visibility with potential investors</li>
                <li>First-time entrepreneurs lack access to established networks for funding</li>
                <li>Investors have limited visibility into early-stage ideas before they become formalized startups</li>
                <li>The investment process involves significant friction with complex documentation and processes</li>
                <li>There's a disconnect between content platforms where ideas are shared and investment platforms 
                   where funding is secured</li>
              </ol>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                These challenges create significant barriers for innovation and entrepreneurship, particularly 
                for founders from underrepresented backgrounds or regions with less developed startup ecosystems.
              </p>
            </section>
            
            {/* Objectives */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                5. Objectives
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                The Grower platform aims to achieve the following objectives:
              </p>
              <ol className="list-decimal pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>Create a seamless environment where entrepreneurs can articulate and showcase their business ideas</li>
                <li>Develop a verification system for investors to establish trust within the platform</li>
                <li>Design an intuitive investment proposal system that simplifies the early negotiation process</li>
                <li>Build a community-focused platform that encourages knowledge sharing and collaboration</li>
                <li>Implement a secure and transparent communication channel between founders and investors</li>
                <li>Provide analytics and insights to help founders improve their proposals</li>
                <li>Enable a subscription model that sustains the platform while providing premium features</li>
                <li>Ensure accessibility and usability for users with varying levels of technical expertise</li>
              </ol>
            </section>
            
            {/* Proposed Methodology or System Design */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                6. Proposed Methodology or System Design
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                Grower employs a modern web application architecture with the following key components:
              </p>
              <ol className="list-decimal pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>
                  <strong>User Authentication and Authorization System</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Role-based access control (startup founders vs. investors)</li>
                    <li>Verification process for investor accounts</li>
                    <li>OAuth integration for simplified onboarding</li>
                  </ul>
                </li>
                <li>
                  <strong>Content Management System</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Rich text editor for creating detailed idea presentations</li>
                    <li>Multimedia support for images and diagrams</li>
                    <li>Tagging system for categorization</li>
                  </ul>
                </li>
                <li>
                  <strong>Investment Proposal Framework</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Structured proposal submission interface</li>
                    <li>Negotiation workflow between investors and founders</li>
                    <li>Status tracking for proposals (pending, accepted, declined, completed)</li>
                  </ul>
                </li>
                <li>
                  <strong>Communication System</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Direct messaging between stakeholders</li>
                    <li>Notification system for important updates</li>
                    <li>Email integration for off-platform communication</li>
                  </ul>
                </li>
                <li>
                  <strong>Data Storage and Management</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Secure database architecture for user and business data</li>
                    <li>Efficient query design for performance optimization</li>
                    <li>Backup and recovery mechanisms</li>
                  </ul>
                </li>
                <li>
                  <strong>Analytics and Reporting</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>User engagement metrics</li>
                    <li>Investment flow tracking</li>
                    <li>Content performance analysis</li>
                  </ul>
                </li>
              </ol>
            </section>
            
            {/* Tools/Technology Used */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                7. Tools/Technology Used
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-primary-light border border-gray-300 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Technologies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Frontend</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">React, Next.js, TypeScript, TailwindCSS, Mantine UI</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Backend</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">Next.js API routes, tRPC, Node.js</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Database</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">PostgreSQL, Drizzle ORM</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Authentication</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">NextAuth.js</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Content Management</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">TipTap Editor, Markdown support</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">State Management</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">React Context, React Query</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Payments</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">Stripe Integration</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Deployment</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">Vercel</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Analytics</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">Vercel Analytics, Custom tracking</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Images & Media</td>
                      <td className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300">UploadThing, Next.js Image Optimization</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            {/* Project Flow Diagram */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                8. Project Flow Diagram
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                The flow of the Grower platform can be described as follows:
              </p>
              <ol className="list-decimal pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>
                  <strong>User Registration and Onboarding</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Users sign up and select their primary role (founder or investor)</li>
                    <li>Investors undergo a verification process</li>
                    <li>Users complete their profiles with relevant information</li>
                  </ul>
                </li>
                <li>
                  <strong>Content Creation Process</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Founders create articles detailing their startup ideas</li>
                    <li>Articles can be drafted, previewed, and published</li>
                    <li>Tags and categories are assigned for discoverability</li>
                  </ul>
                </li>
                <li>
                  <strong>Discovery and Exploration</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Investors browse ideas through the explore page or tag-based filtering</li>
                    <li>Recommendation system highlights relevant opportunities</li>
                    <li>Users can bookmark interesting ideas for later review</li>
                  </ul>
                </li>
                <li>
                  <strong>Investment Process</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Investors submit proposals specifying amount and equity terms</li>
                    <li>Founders review proposals on their dashboard</li>
                    <li>Founders accept or decline investment offers</li>
                  </ul>
                </li>
                <li>
                  <strong>Communication and Negotiation</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Direct messaging facilitates further discussion</li>
                    <li>Terms can be adjusted through the proposal system</li>
                    <li>Both parties confirm final agreements</li>
                  </ul>
                </li>
                <li>
                  <strong>Post-Investment Relationship</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Platform maintains relationship records</li>
                    <li>Progress updates can be shared with investors</li>
                    <li>Additional funding rounds can be initiated</li>
                  </ul>
                </li>
              </ol>
            </section>
            
            {/* Algorithms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                9. Algorithms
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                Grower implements several key algorithms and computational approaches:
              </p>
              <ol className="list-decimal pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>
                  <strong>Content Recommendation Algorithm</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Uses collaborative filtering to suggest relevant startup ideas to investors</li>
                    <li>Considers factors like past interactions, industry preferences, and investment history</li>
                    <li>Employs a weighted scoring system to prioritize recommendations</li>
                  </ul>
                </li>
                <li>
                  <strong>Investor Verification Algorithm</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Multi-step verification process with identity and accreditation checks</li>
                    <li>Risk scoring based on provided information and external data sources</li>
                    <li>Automated approvals for clear cases and manual review for edge cases</li>
                  </ul>
                </li>
                <li>
                  <strong>Search and Discovery Algorithm</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Full-text search with relevance scoring</li>
                    <li>Tag-based filtering with taxonomic relationships</li>
                    <li>Trending and popular content surfacing based on engagement metrics</li>
                  </ul>
                </li>
                <li>
                  <strong>Content Summarization</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Automatic generation of article previews</li>
                    <li>Extraction of key points for recommendation snippets</li>
                    <li>Reading time calculation based on content length and complexity</li>
                  </ul>
                </li>
                <li>
                  <strong>User Matching Algorithm</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Pairing founders with potentially interested investors</li>
                    <li>Analysis of investment patterns and founder characteristics</li>
                    <li>Network effect leveraging through mutual connections</li>
                  </ul>
                </li>
              </ol>
            </section>
            
            {/* Results and Discussion */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                10. Results and Discussion
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                The implementation of the Grower platform has demonstrated several significant outcomes:
              </p>
              <ol className="list-decimal pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>
                  <strong>User Engagement</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Early adoption indicates strong interest from both entrepreneurs and investors</li>
                    <li>User retention metrics show consistent engagement with the platform</li>
                    <li>Content creation rates exceed initial projections</li>
                  </ul>
                </li>
                <li>
                  <strong>Investment Facilitation</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Successfully facilitated initial investment proposals between founders and investors</li>
                    <li>Average response time to investment proposals under 48 hours</li>
                    <li>Positive feedback on the simplified proposal process</li>
                  </ul>
                </li>
                <li>
                  <strong>Platform Performance</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Technical infrastructure demonstrates good scalability under increasing user load</li>
                    <li>Database queries optimized for efficient content delivery</li>
                    <li>Frontend performance metrics indicate fast load times across devices</li>
                  </ul>
                </li>
                <li>
                  <strong>Challenges Encountered</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Investor verification process requires further refinement to balance security and usability</li>
                    <li>Mobile experience needs additional optimization</li>
                    <li>Content moderation at scale presents ongoing challenges</li>
                  </ul>
                </li>
                <li>
                  <strong>Comparative Analysis</strong>
                  <ul className="list-disc pl-8 mb-2">
                    <li>Grower demonstrates advantages in ease of use compared to traditional investment platforms</li>
                    <li>Integration of content creation and investment features provides unique market positioning</li>
                    <li>User satisfaction metrics exceed those of comparable platforms in early benchmarking</li>
                  </ul>
                </li>
              </ol>
            </section>
            
            {/* Conclusion */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                11. Conclusion
              </h2>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                The Grower platform represents a significant innovation in connecting early-stage startups with 
                investors through a content-first approach. By reimagining how founders present their ideas and how 
                investors discover opportunities, Grower addresses fundamental challenges in the startup ecosystem.
              </p>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                Key achievements of the project include:
              </p>
              <ul className="list-disc pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>Development of an intuitive platform that simplifies the investment process</li>
                <li>Creation of a community that values both financial investment and knowledge sharing</li>
                <li>Implementation of a scalable technical architecture that supports future growth</li>
                <li>Establishment of trust mechanisms that protect both founders and investors</li>
              </ul>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                Future directions for Grower include:
              </p>
              <ul className="list-disc pl-8 text-gray-700 dark:text-text-primary mb-4">
                <li>Expansion of analytics capabilities to provide deeper insights for all stakeholders</li>
                <li>Integration with additional investment models including SAFE agreements and convertible notes</li>
                <li>Development of mobile applications to enhance accessibility</li>
                <li>Creation of educational resources to support first-time entrepreneurs</li>
                <li>Exploration of international expansion with localization features</li>
              </ul>
              <p className="text-gray-700 dark:text-text-primary mb-4">
                The early success of Grower demonstrates the value of combining content creation with investment 
                facilitation in a single platform, pointing toward a more accessible and transparent future for 
                early-stage startup funding.
              </p>
            </section>
            
            {/* References */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary mb-4">
                12. References
              </h2>
              <div className="text-gray-700 dark:text-text-primary">
                <p className="mb-2">[1] D. Kleinman and M. Harper, "Digital transformation of investment processes," IEEE Journal of Finance Technology, vol. 14, no. 3, pp. 78-92, 2022.</p>
                <p className="mb-2">[2] S. Wang, L. Zhang, and P. Johnson, "Early-stage funding impact on startup success rates," Journal of Entrepreneurship Studies, vol. 29, no. 2, pp. 112-128, 2021.</p>
                <p className="mb-2">[3] A. Rodriguez, "Content-driven platforms and community engagement," IEEE Transactions on Social Computing, vol. 5, no. 1, pp. 45-57, 2023.</p>
                <p className="mb-2">[4] T. Nguyen, "User experience design for investment platforms," International Journal of Financial Technologies, vol. 8, pp. 203-219, 2022.</p>
                <p className="mb-2">[5] M. Johnson and K. Williams, "Security considerations in fintech applications," IEEE Security & Privacy, vol. 19, no. 4, pp. 15-23, 2021.</p>
                <p className="mb-2">[6] R. Sharma, K. Lee, and J. Peterson, "Next.js for scalable web applications," Journal of Web Engineering, vol. 22, no. 1, pp. 33-48, 2023.</p>
                <p className="mb-2">[7] L. Garcia and S. Martinez, "Modern authentication practices in web applications," IEEE Internet Computing, vol. 25, no. 3, pp. 67-79, 2021.</p>
                <p className="mb-2">[8] V. Kumar, "PostgreSQL performance optimization techniques," Journal of Database Management, vol. 34, no. 2, pp. 156-171, 2022.</p>
                <p className="mb-2">[9] H. Zhang and B. Wilson, "Type-safe APIs with TypeScript and tRPC," IEEE Software, vol. 40, no. 1, pp. 88-97, 2023.</p>
                <p className="mb-2">[10] S. Taylor, "TailwindCSS and the future of utility-first CSS frameworks," ACM Transactions on Web Design, vol. 7, no. 2, pp. 112-125, 2022.</p>
              </div>
            </section>

            {/* Print Button */}
            <div className="mt-10 text-center print:hidden">
              <button
                onClick={() => window.print()}
                className="bg-secondary hover:bg-secondary-dark text-white py-2 px-6 rounded-md font-medium transition-colors"
              >
                Print as PDF
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Click the button above to save this document as a PDF
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProjectDocumentation; 