
if (/^#\//.test(location.hash)) { location.replace(location.hash.slice(1)); }

(function(){
  var EMAIL = "email@theharnessproject.org";
  /* THE SIGNAL — newsletter service hookup.
     Leave SIGNAL_ENDPOINT empty and sign-ups arrive as emails to EMAIL (the visitor's mail app opens a drafted request).
     To send sign-ups straight into a newsletter service, paste its embed-form URL here and set the field names it expects:
       Buttondown: "https://buttondown.com/api/emails/embed-subscribe/<your-username>"  email field "email"
       Kit (ConvertKit): "https://app.kit.com/forms/<form-id>/subscriptions"         email field "email_address", name field "fields[first_name]"
       Mailchimp: the form action URL from Mailchimp's embedded form                 email field "EMAIL", name field "FNAME" */
  var SIGNAL_ENDPOINT = "";
  var SIGNAL_EMAIL_FIELD = "email";
  var SIGNAL_NAME_FIELD = "name";
  document.querySelectorAll('img[data-src-ref]').forEach(function(i){ var src = document.getElementById(i.getAttribute('data-src-ref')); if (src) i.src = src.getAttribute('src'); });
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var nav = document.getElementById('nav');
  var menuBtn = document.querySelector('.menu-btn');

  /* ===== Blog posts =====
     To add a post: copy one object, give it a unique slug, set audience to adult | youth | educator.
     Remove draft:true once the post is reviewed. Newest date appears first.
     Reading time is calculated from the body. question = the post's Today's Question (adult/HARNESS posts only).
     POST TEMPLATE (Hook-Pivot): hero, hookTime + hook (Beat 1), pivot label + body (Beat 2), takeaway, closing,
     then question (adult: Today's Question, answered in comments) or reflect (youth/educator: reflection only).
     hero = pep | three | ghosts | fries, or add a new function to HEROES.
     updated = "YYYY-MM-DD" whenever a post's text changes after it's published; it shows as "Updated <date>" in the byline.
     comments = approved comments only (adult/HARNESS posts only). The Brave Space section never renders on youth or educator posts, e.g. {name:"Jay", date:"2026-09-20", text:"..."} */
  var LANE_ART = {
    CREST_PARENT: "/assets/img/20a936859ab0.webp",
    MAST_ADULT: "/assets/img/1494362e6989.webp",
    MAST_YOUTH: "/assets/img/01ec12100724.webp",
    MAST_EDU: "/assets/img/b6a0c71a80eb.webp",
    CREST_ADULT: "/assets/img/11e644879bc0.webp",
    CREST_YOUTH: "/assets/img/e63090ca39f1.webp",
    SEAL_EDU: "/assets/img/ac5e1cc5ecb3.webp"
  };
  var POSTS = [
    {
      slug: "the-cost-ghost",
      title: "The Cost ghost: staying on PrEP when money is tight",
      audience: "adult", date: "2026-10-18", hero: "costghost",
      heroAlt: "A pharmacy receipt with a crossed-out price over a starfield and grid floor, beside a dollar sign shrinking toward zero and the Adults blog crest.",
      question: "If cost tried to knock one piece out of your plan this month, which piece would it be, and what's your workaround?", comments: [],
      excerpt: "Rent is due, the refill is due, and only one of them is getting paid. Before you let PrEP lapse, here are the cheaper roads most people never check.",
      hookTime: "11:20 p.m.",
      hook: `
<p>The pharmacy app pings: your PrEP refill is ready. Your bank app says rent clears Friday. You do the math twice and get the same answer.</p>
<blockquote>"I'll skip this month. I'll just be careful."</blockquote>
<p>That sentence feels responsible. It's the Cost ghost talking, and it's quietly removing the one piece of your plan that works whether or not anyone is careful.</p>`,
      pivot: "MATCH Framework",
      body: `
<h2>Name the Ghosts</h2>
<ul>
<li><b>Cost:</b> "I can't afford it this month." Many people paying out of pocket for PrEP don't have to. Check before you skip.</li>
<li><b>Shame:</b> "Asking for help with money is embarrassing." Clinics field this question every day. It's routine.</li>
<li><b>Bureaucracy:</b> "The paperwork isn't worth it." One phone call usually gets you to the right person.</li>
<li><b>Timing:</b> "I'll restart when things calm down." Gaps are when protection is weakest. Plan the restart before you stop.</li>
</ul>
<h2>Four cheaper roads to check first</h2>
<ol>
<li><b>Your insurance, rechecked.</b> As of this writing, most private plans must cover PrEP and its required visits and lab tests with no copay under federal preventive-care rules. If you're being charged, call the plan and ask them to review how it was billed.</li>
<li><b>Generic PrEP.</b> Generic daily pills are available and cost far less than the brand name. Ask your provider and pharmacist about it.</li>
<li><b>Assistance programs.</b> Drug makers and nonprofits run programs that can cover the medicine or the copay. Your clinic or pharmacist can point you to the current ones.</li>
<li><b>Sliding-scale clinics.</b> Community health centers and health department clinics price visits and labs by income. In Houston, start with Legacy Community Health or Harris Health.</li>
</ol>
<div class="callout"><p style="margin:0"><b>Say it plainly:</b> "I'm on PrEP and cost is getting in the way. What programs or cheaper options can you help me with?"</p></div>
<h2>If you already missed doses</h2>
<ul>
<li><b>Don't just restart quietly.</b> Call your provider first. You may need an HIV test before restarting, and they'll tell you how to restart safely.</li>
<li><b>Had a possible exposure during the gap?</b> PEP must start within 72 hours. Go to an emergency room and ask for it.</li>
<li><b>Use your other layers.</b> Condoms, testing, and fewer risky situations carry more of the load until PrEP is back.</li>
</ul>
<h2>Map it to MATCH</h2>
<ul>
<li><b>Medications:</b> PrEP stays in the plan. Cost changes the route, not the destination.</li>
<li><b>Awareness:</b> know your next refill date and your next test date.</li>
<li><b>Tools:</b> keep condoms stocked so a gap isn't a free fall.</li>
<li><b>Communication:</b> tell your provider about money before it becomes a missed month.</li>
<li><b>Habits:</b> set a refill reminder five days early, so cost problems surface while you still have pills.</li>
</ul>
<p><i>This is education, not medical, legal, or financial advice. Programs and coverage rules change, so confirm details with your provider, pharmacist, or plan.</i></p>`,
      takeaway: "Cost changes the route, not the destination. Make the call before you skip the refill.",
      closing: `<p>The Cost ghost wins when it gets you alone at 11 p.m. with a bank app and no options. Name it, make one call, and let someone whose job is solving this help you keep the plan running.</p>`
    },
    {
      slug: "the-group-chat-screenshot",
      title: "The Group Chat Screenshot",
      audience: "youth", date: "2026-10-18", hero: "groupchat",
      heroAlt: "A phone showing a group chat with a blurred screenshot and laughing reactions, a hand hovering over the forward button, beside the CAPE crest on graph paper.",
      excerpt: "Someone drops an embarrassing screenshot of a classmate in the group chat. Everyone's reacting. You've got about three seconds to decide who you are.",
      hookTime: "9:47 p.m.",
      hook: `
<p>The group chat explodes. Someone posted a screenshot of a classmate's private message. It's embarrassing. The laughing emojis are already stacking up.</p>
<blockquote>"lmaooo forward this to the other chat 💀"</blockquote>
<p>Your thumb is right there. Nobody would notice if you just reacted and moved on. But someone is going to wake up tomorrow to the worst day of their year.</p>`,
      pivot: "CAPE Decision GPS",
      body: `
<h2>Name the Ghosts</h2>
<ul>
<li><b>Left Out:</b> "If I don't laugh, I'm not part of the group." Real friends don't need you to join in on hurting someone.</li>
<li><b>It's Not My Business:</b> "I didn't post it." Every forward, every reaction makes it spread faster.</li>
<li><b>Target Swap:</b> "If I say something, they'll come for me next." That fear is real. There are quiet ways to help, too.</li>
<li><b>It's Just a Joke:</b> "Everyone's laughing." It's not a joke if one person isn't.</li>
</ul>
<h2>Run the 3-Second Rule, backwards</h2>
<p>You know the 3-Second Rule for what you send. It works for what you pass along, too.</p>
<ol>
<li><b>Legacy Check:</b> Would you want this to be the thing people remember you sharing?</li>
<li><b>Billboard Check:</b> Would you be okay if your name were next to the forward?</li>
<li><b>FRIES Check:</b> Did the person in the screenshot agree to this being shared? It fails Freely given and Reversible right away.</li>
</ol>
<div class="callout"><p style="margin:0"><b>The rule:</b> if it wasn't yours to share, don't forward it, don't react to it, and don't save it.</p></div>
<h2>Four moves, from quiet to loud</h2>
<ul>
<li><b>Don't feed it.</b> No forward, no reaction. Silence slows it down.</li>
<li><b>Change the subject.</b> "Anyway, did anyone finish the bio homework?"</li>
<li><b>Say one line.</b> "Not funny. Delete it." or "That's not ours to share."</li>
<li><b>Check on them.</b> A private text to the person: "Saw what got posted. That wasn't okay. You good?"</li>
</ul>
<blockquote>You don't have to be the hero of the group chat. You just can't be the one who helped it spread.</blockquote>
<h2>Check your MATCH Compass</h2>
<ul>
<li><b>Health Armor:</b> how people treat each other online is part of everyone's health.</li>
<li><b>Built-In Radar:</b> a pile-on, a "forward this," and a private message made public are three warning signs.</li>
<li><b>Safety Kit:</b> know which trusted adult you'd show this to if it keeps going.</li>
<li><b>Strongest Voice:</b> one line is enough. You don't need to win the argument.</li>
<li><b>Daily Superpower:</b> mute the chat for the night if it keeps blowing up.</li>
</ul>
<h2>If it's bigger than embarrassing</h2>
<ol>
<li><b>Screenshot it for an adult, not the group.</b> Save it to show a trusted adult or school staff, then don't share it anywhere else.</li>
<li><b>Report it in the app.</b> Most apps let you report a message or post.</li>
<li><b>If it's a private or sexual image of someone under 18,</b> don't save or forward it at all. Tell a trusted adult right away. <a href="https://takeitdown.ncmec.org">Take It Down</a> helps get those images removed.</li>
</ol>`,
      takeaway: "If it wasn't yours to share, don't forward it, don't react to it, and don't save it.",
      closing: `<p>Group chats move fast so nobody has time to think. Your CAPE is the three seconds where you decide who you are, and the text you send to the person who's hurting.</p>`,
      reflect: "What's one line you could drop in a group chat to stop a pile-on without making yourself the next target?",
      reflectNote: "Families: ask your teen what happens in their group chats when someone gets embarrassed. Listen first. This mirrors CAPE Lesson 5, The Boundary Shield."
    },
    {
      slug: "the-phone-plan",
      title: "The family phone plan that isn't a punishment",
      audience: "parent", date: "2026-10-18", hero: "phoneplan",
      heroAlt: "A phone charging on a kitchen counter at night next to a handwritten family phone plan, beside the Parents and Caregivers crest.",
      excerpt: "The worst messages arrive after midnight. Here's how to build a phone plan with your teen, not against them, so the phone sleeps outside the bedroom without a fight.",
      hookTime: "10:30 p.m.",
      hook: `
<p>You walk past your teen's door and see the glow under it. Again. You know what you want to say. You also know how it'll land.</p>
<blockquote>"You never trust me. Everyone else has their phone at night."</blockquote>
<p>So you say nothing, or you take the phone and spend the morning in a cold war. Neither one is the plan you actually want.</p>`,
      pivot: "CAPE Decision GPS",
      body: `
<h2>Name your Ghosts</h2>
<ul>
<li><b>Controlling:</b> "Rules will push them away." Rules made together pull them closer.</li>
<li><b>Too Late:</b> "They're too old for this now." Teens still want limits. They want a say in them.</li>
<li><b>Hypocrite:</b> "I'm on my phone all night too." Good. That's your opening. Make the plan for the whole house.</li>
<li><b>Snooping:</b> "I have to read everything to keep them safe." Trust and check-ins work better than secret searches.</li>
</ul>
<h2>Why after midnight matters</h2>
<p>CAPE teaches teens that pressure is built to make you move fast, and late-night messages are where it hits hardest. Tired brains decide quickly and regret slowly. The 3-Second Rule works best when the phone isn't under the pillow.</p>
<div class="callout"><p style="margin:0"><b>The CAPE habit:</b> charge the phone outside the bedroom after a set time. It's part of the Daily Superpower your teen practices in class.</p></div>
<h2>Build the plan together in four steps</h2>
<ol>
<li><b>Ask first.</b> "What's the worst thing that happens on phones after midnight?" Let them tell you.</li>
<li><b>Pick the time together.</b> Agree on a "phone sleeps" time for school nights and weekends.</li>
<li><b>Pick the spot together.</b> A charging station in the kitchen. Everyone's phone goes there, adults included.</li>
<li><b>Write it down.</b> One sticky note on the fridge. Revisit it in a month, and loosen it if it's working.</li>
</ol>
<blockquote>The plan works because it's ours, not mine.</blockquote>
<h2>What to say when it gets pushback</h2>
<ul>
<li>"This isn't about trust. It's about sleep and the 1 a.m. messages nobody needs."</li>
<li>"I'm doing it too. My phone sleeps there as well."</li>
<li>"If something important happens at night, you can always come wake me."</li>
<li>"Let's try it for a month and talk about what to change."</li>
</ul>
<h2>Make the code-text deal too</h2>
<p>A phone plan isn't only about limits. It's also a lifeline. Agree on one code text that means "come get me, no questions tonight," and keep that promise. See <a href="/blog/the-ride-home-plan">The Ride Home Plan</a>.</p>`,
      takeaway: "Make the phone plan with your teen, include yourself, and revisit it in a month.",
      closing: `<p>The goal isn't a perfect phone schedule. It's a house where the hardest messages arrive in daylight, and where your teen knows the code text always works.</p>`,
      reflect: "This week, ask: “What's the worst thing that happens on phones after midnight?” Then build the plan from their answer.",
      reflectNote: "Want to see how CAPE teaches the 3-Second Rule and Daily Superpower? Request the CAPE parent preview."
    },
    {
      slug: "track-integrity",
      title: "Track integrity: when a teacher asks you to go further",
      audience: "educator", date: "2026-10-18", hero: "trackgate",
      heroAlt: "Two lanes on a slate blueprint grid, a green lane stopping at a locked gate and a blue lane continuing past it, beside the Certified Facilitator seal.",
      excerpt: "A well-meaning classroom teacher asks you to cover protection with 7th graders. What to say, what to offer instead, and why the gate stays closed.",
      hookTime: "1:15 p.m.",
      hook: `
<p>Your Green Track session with 7th graders just ended. The classroom teacher catches you at the door, smiling.</p>
<blockquote>"Honestly, they're ready for more. Can you just cover condoms and PrEP next time? It'll save them later."</blockquote>
<p>They mean well. Some of the students might even agree. And saying yes would quietly break the one rule that keeps CAPE in schools.</p>`,
      pivot: "Facilitator protocol",
      body: `
<h2>Name your Ghosts</h2>
<ul>
<li><b>People-Pleaser:</b> "Saying no will damage the relationship." A clear, kind no builds more trust than a quiet yes.</li>
<li><b>They Need It:</b> "These kids might really need this information." Maybe. The answer is the right track and the right approval, not a shortcut.</li>
<li><b>Just This Once:</b> "Nobody will know." Students tell parents. Parents call principals. Programs end that way.</li>
<li><b>Authority:</b> "The teacher outranks me in this room." The track rules and the site agreement outrank both of you.</li>
</ul>
<h2>Why the gate stays closed</h2>
<ul>
<li><b>Two gates, one rule:</b> Part 3 (Protection Shields) and Part 5 (The Green Light Pivot) are Blue Track only, grades 9–12. They are never delivered to Green Track.</li>
<li><b>Families signed up for what they saw.</b> Parent consent and previews cover the track your students are in. Changing content mid-pilot breaks that promise.</li>
<li><b>Approval belongs to the site.</b> Protection content is taught only with the institution's approval.</li>
</ul>
<div class="callout"><p style="margin:0"><b>The standard:</b> deliver what was approved, to the track it was approved for. Anything else is a conversation for the administrator, not a change you make at the door.</p></div>
<h2>What to say, word for word</h2>
<ol>
<li><b>Acknowledge.</b><blockquote>"I love that you care this much about them being ready."</blockquote></li>
<li><b>Hold the line.</b><blockquote>"Protection content is Blue Track only, grades 9–12, and only with the school's approval. I can't add it to a Green Track group."</blockquote></li>
<li><b>Offer what's in bounds.</b><blockquote>"What I can do is go deeper on the Green Track pieces that set them up: boundaries, the 3-Second Rule, and finding a trusted adult."</blockquote></li>
<li><b>Point to the right door.</b><blockquote>"If the school wants Blue Track for older students, let's bring that to [administrator] together."</blockquote></li>
</ol>
<h2>If a student asks the question directly</h2>
<ul>
<li><b>Don't ignore it, and don't teach the Blue Track lesson.</b></li>
<li><b>Use the bridge:</b> "That's a great question. It's covered in high school. For now, the best person to ask is a parent, a trusted adult, or a doctor."</li>
<li><b>Follow up</b> with your co-facilitator, and note it for the site contact if several students are asking.</li>
</ul>
<h2>Why it's in certification</h2>
<p>Track integrity pressure from a classroom teacher is one of the five live scenarios in the CAPE facilitator assessment. Holding the line kindly is a core facilitation skill, not a technicality.</p>
<p><i>This is educational guidance, not legal advice. Follow your site agreement, district policy and your certification training.</i></p>`,
      takeaway: "Acknowledge, hold the line, offer what's in bounds, and point to the right door.",
      closing: `<p>The gate isn't there to keep students from information. It's there to keep the program in the building, so every student gets the next lesson at the right time.</p>`,
      reflect: "Which of the four lines would be hardest for you to say to a teacher you like?",
      reflectNote: "Rehearse the full script with your co-facilitator before your next Green Track session."
    },
    {
      slug: "what-your-teen-will-hear-in-cape",
      title: "What your teen will hear in CAPE, and what to say at dinner",
      audience: "parent", date: "2026-10-16", hero: "dinner",
      heroAlt: "A dinner table seen from above with two plates and two speech bubbles, a teen saying we learned about boundaries today and a parent asking what stood out, beside the Parents and Caregivers crest.",
      excerpt: "Your teen just said, “We talked about consent and boundaries in health today.” Here's what CAPE actually teaches, and five questions that keep the conversation going.",
      hookTime: "6:42 p.m.",
      hook: `
<p>Dinner is almost over. Your teen pushes a fork around the plate and says it, almost casually.</p>
<blockquote>"We talked about consent and boundaries in health today."</blockquote>
<p>You freeze. Ask too much and they shut down. Say nothing and the moment is gone. Most parents have about ten seconds to decide which way this goes.</p>`,
      pivot: "CAPE Decision GPS",
      body: `
<h2>Name your Ghosts</h2>
<p>Parents have ghosts too: fears that make us go quiet when our kids open a door.</p>
<ul>
<li><b>Awkward:</b> "This will be uncomfortable for both of us." It will be, for about a minute. That's fine.</li>
<li><b>Too Early:</b> "Talking about it will give them ideas." Talking about health and boundaries doesn't push teens into anything. It gives them words for moments they're already facing.</li>
<li><b>Wrong Answer:</b> "I won't know what to say." You don't need answers. "I don't know, let's find out" is a great answer.</li>
<li><b>Lecture:</b> "This is my chance to cover everything." One good question beats ten minutes of warnings.</li>
</ul>
<h2>What your teen will hear in CAPE</h2>
<p>CAPE stands for Confident, Aware, Protected, Empowered. It's a leadership-based health curriculum for grades 6–12, aligned to Texas TEKS health standards.</p>
<ul>
<li><b>Grades 6–8, Green Track:</b> respecting yourself, speaking up, healthy vs. unhealthy relationships, red flags, consent and boundaries, staying safe online, finding real care, and what to do if a boundary was crossed.</li>
<li><b>Grades 9–12, Blue Track:</b> everything above, plus protection and medical topics, taught only with your school or program's approval.</li>
<li><b>Choosing your pace:</b> waiting is taught as the only 100% effective choice, and as a leadership move.</li>
<li><b>Your say:</b> CAPE asks for a parent's written consent before your student takes part, and you can preview the materials first.</li>
</ul>
<div class="callout"><p style="margin:0"><b>The tools they'll bring home:</b> FRIES (consent that is Freely given, Reversible, Informed, Enthusiastic, Specific), the Boundary Menu (what's on and off the table), the 3-Second Rule (pause before you send), and the MATCH Compass (five checks for any tough moment).</p></div>
<h2>Five things to say at dinner</h2>
<p>Pick one. Ask it, then listen twice as long as you talk.</p>
<ul>
<li>"What's one thing from health class that surprised you?"</li>
<li>"What's a red flag you learned about? Have you seen one?"</li>
<li>"What's on your Boundary Menu? What's a Do Not Serve for you?"</li>
<li>"Teach me the 3-Second Rule. I want to try it."</li>
<li>"If you ever needed a way out of somewhere, who would you text?"</li>
</ul>
<blockquote>Asking them to teach you is the fastest way in. Teens love being the expert.</blockquote>
<h2>Five moves that keep the door open</h2>
<ol>
<li><b>Ask, don't quiz.</b> Open questions, no right answers.</li>
<li><b>Stay calm.</b> Your face tells them whether they can come back.</li>
<li><b>Thank them.</b> "Thanks for telling me" is the most powerful sentence you have.</li>
<li><b>Be one of their 3–5 trusted adults.</b> CAPE asks every student to name theirs. Make sure you're on the list.</li>
<li><b>Make the code-text deal.</b> One text means "come get me, no questions tonight." See <a href="/blog/the-ride-home-plan">The Ride Home Plan</a>.</li>
</ol>
<h2>If they tell you something hard</h2>
<ul>
<li><b>Stay calm and believe them.</b> "I'm glad you told me. This isn't your fault."</li>
<li><b>Don't promise to keep it secret</b> if someone is being hurt. Promise to help.</li>
<li><b>Get support.</b> Talk with the school counselor or your child's doctor.</li>
</ul>
<div class="callout"><p style="margin:0"><b>If a child is being abused or is in danger:</b> call 911 if it's an emergency. In Texas, report suspected abuse to the Texas Abuse Hotline at 1-800-252-5400 or <a href="https://www.txabusehotline.org">txabusehotline.org</a>.</p></div>`,
      takeaway: "Ask one open question, then listen twice as long as you talk.",
      closing: `<p>You don't have to be the expert. CAPE gives your teen the words. Your job is to be the calm adult they bring those words home to. The conversation you have at dinner tonight is the one they'll remember at 1 a.m.</p>`,
      reflect: "Tonight, ask: “What's one thing from health class that surprised you?” Then just listen.",
      reflectNote: "Want to see the lessons before your student starts? Request the CAPE parent preview."
    },
    {
      slug: "the-ride-home-plan",
      title: "The Ride Home Plan",
      audience: "youth", date: "2026-10-16", hero: "ridehome",
      heroAlt: "A dotted route on graph paper from a party pin to a house, with a phone showing a pick-me-up text and a compass star.",
      excerpt: "It's 11:36 p.m. and your ride home just stopped being safe. One code text and a plan you made earlier get you out.",
      hookTime: "11:36 p.m.",
      hook: `
<p>The party was fine until it wasn't. The music is loud, the vibe changed, and the friend who drove you here is now holding a drink.</p>
<blockquote>"We're good, I'm fine to drive. Let's go."</blockquote>
<p>Everyone is heading for the car. Saying no feels like ruining the night. Saying yes means riding with someone who shouldn't be driving.</p>`,
      pivot: "CAPE Decision GPS",
      body: `
<h2>Name the Ghosts</h2>
<p>Ghosts are the fears that make a risky choice feel like the only choice. Name them and you get your choice back.</p>
<ul>
<li><b>Ruining It:</b> "Everyone will be mad at me." A ride home is not worth your safety. Real friends get over it by Monday.</li>
<li><b>Getting in Trouble:</b> "If I call home, I'm grounded forever." Most adults care more that you called than why.</li>
<li><b>It's Probably Fine:</b> "It's only a few minutes." Short drives are still drives. Your radar is already telling you something.</li>
<li><b>No Way Out:</b> "I don't have another ride." That's what a plan is for.</li>
</ul>
<h2>Build your Ride Home Plan before you go</h2>
<ol>
<li><b>Two rides:</b> know who's driving you there and who your backup is, before you leave the house.</li>
<li><b>One code text:</b> agree on a single text with a trusted adult, like an "X" or an emoji. It means: call me, say you need me home, and come get me. No questions tonight.</li>
<li><b>Charged phone:</b> leave with at least 50% and a way to share your location.</li>
<li><b>One buddy:</b> someone who leaves with you, or knows exactly when you left.</li>
</ol>
<div class="callout"><p style="margin:0"><b>The deal:</b> the code text gets you a pickup now and a conversation later, when everyone is calm. Make that deal with your adult ahead of time.</p></div>
<h2>Say it in one line</h2>
<p>You don't need to explain. Pick a line and use it.</p>
<ul>
<li>"I'm good, my mom's picking me up."</li>
<li>"Nah, I'll catch a ride. Text me when you're home."</li>
<li>"My dad just texted, I have to go."</li>
<li>"Give me your keys. Let's call someone."</li>
</ul>
<blockquote>Letting your parent be the bad guy is a power move, not a weakness.</blockquote>
<h2>Check your MATCH Compass</h2>
<ul>
<li><b>Health Armor:</b> getting home safe is the whole point.</li>
<li><b>Built-In Radar:</b> drinking, a change in mood, or pressure to leave fast are three warning signs.</li>
<li><b>Safety Kit:</b> a charged phone, a ride plan, a buddy, and 3–5 trusted adults on speed dial.</li>
<li><b>Strongest Voice:</b> one line, said once, then step away.</li>
<li><b>Daily Superpower:</b> make the plan before you need it, every time you go out.</li>
</ul>
<h2>If you can't reach anyone</h2>
<ol>
<li><b>Stay put.</b> Stay inside with a person you trust, not in a car or out on the street.</li>
<li><b>Keep calling.</b> Go down your trusted-adult list. A friend's parent counts.</li>
<li><b>Call 911 if you're in danger</b> or someone is too impaired to be safe, or is about to drive that way.</li>
</ol>
<div class="callout"><p style="margin:0"><b>If someone is passed out or can't be woken:</b> call 911 right away. Don't let fear of getting anyone in trouble decide for you.</p></div>`,
      takeaway: "Two rides, one code text, a charged phone, and one buddy. Plan it before you need it.",
      closing: `<p>Plans fall apart at parties. The people who get home safe aren't the ones who never face 11:36 p.m. They're the ones who planned for it earlier. You were always the pilot.</p>`,
      reflect: "Who are the two adults you could send a code text to tonight? Set it up with one of them this week.",
      reflectNote: "Families: agree on a code text with your teen tonight, and promise the pickup comes first and the questions come later."
    },
    {
      slug: "doxy-pep-backup",
      title: "Doxy-PEP: a 72-hour backup for bacterial STIs",
      audience: "adult", date: "2026-10-16", updated: "2026-10-26", hero: "doxy",
      heroAlt: "A glowing capsule over a starfield and grid floor, with three signal bars labeled syphilis, chlamydia and gonorrhea.",
      question: "If your provider offered doxy-PEP tomorrow, what's one question you'd want answered before you said yes?", comments: [],
      excerpt: "You had sex without a condom last night, and you've had an STI this year. Doxy-PEP is a backup with a clock on it. Here's how it works.",
      hookTime: "7:40 a.m.",
      hook: `
<p>Last night was good. This morning, you remember there was no condom. You're on PrEP, so HIV isn't what's on your mind.</p>
<p>What is: the syphilis diagnosis you dealt with in the spring. You don't want a repeat. Your provider mentioned something called doxy-PEP, and you never followed up.</p>`,
      pivot: "MATCH Framework",
      body: `
<h2>Name the Ghosts</h2>
<ul>
<li><b>Shame:</b> "Needing this means I'm reckless." Using every tool available is a strategy, not a confession.</li>
<li><b>Judgment:</b> "My provider will think less of me." Asking for doxy-PEP is the conversation your provider is trained to have.</li>
<li><b>Access:</b> "I don't have a prescription." You can ask for one in advance, so it's in your bag before you need it.</li>
<li><b>Timing:</b> "It's too late now." You have up to 72 hours. Act today.</li>
</ul>
<h2>What doxy-PEP is</h2>
<p>Doxy-PEP (doxycycline post-exposure prophylaxis) is an antibiotic taken after sex to lower the chance of getting certain bacterial STIs.</p>
<div class="callout"><p style="margin:0"><b>How it's used:</b> one 200 mg dose of doxycycline, taken as soon as possible and within 72 hours after oral, anal, or vaginal sex. Never more than 200 mg in 24 hours.</p></div>
<ul>
<li><b>What it reduces:</b> in clinical trials, syphilis by about 80–87% and chlamydia by about 87–88% (CDC, 2024).</li>
<li><b>The gonorrhea gap:</b> early trials showed partial protection against gonorrhea. A large Kaiser Permanente Southern California study (<i>The Lancet Infectious Diseases</i>, May 2026) found no measurable gonorrhea benefit by 2025 as resistant strains spread. Protection against chlamydia and syphilis held.</li>
<li><b>If you do get gonorrhea:</b> it's still treatable. CDC's recommended treatment is still a single ceftriaxone shot. Two oral antibiotics approved in December 2025 are reserved for people who can't use the standard treatment.</li>
<li><b>What it doesn't touch:</b> HIV, mpox, herpes, or HPV. Keep PrEP, vaccines, and condoms in your plan.</li>
<li><b>Who it's recommended for:</b> CDC recommends it for gay and bisexual men and transgender women who've had syphilis, chlamydia, or gonorrhea in the past 12 months. If that's not you, ask your provider whether it fits your situation.</li>
</ul>
<h2>Your next three moves</h2>
<ol>
<li><b>Call today.</b> Your PrEP provider, a sexual health clinic, or a telehealth service can prescribe it.</li>
<li><b>Say it plainly.</b> Use the script below.</li>
<li><b>Book your testing.</b> People using doxy-PEP should test for STIs every 3–6 months.</li>
</ol>
<blockquote>"I'm interested in doxy-PEP. I had a bacterial STI this year and I want a prescription I can keep on hand."</blockquote>
<h2>Map it to MATCH</h2>
<ul>
<li><b>Medications:</b> doxy-PEP sits beside PrEP, not in place of it.</li>
<li><b>Awareness:</b> test every 3–6 months, and know your results.</li>
<li><b>Tools:</b> condoms still prevent HIV and STIs that doxy-PEP misses.</li>
<li><b>Communication:</b> tell partners what you're using, and ask your provider about side effects and how to take it.</li>
<li><b>Habits:</b> keep a filled prescription where you'll have it within 72 hours.</li>
</ul>
<p><i>This is education, not medical advice. Talk with a healthcare provider about whether doxy-PEP is right for you.</i></p>`,
      takeaway: "Doxy-PEP is a backup with a 72-hour clock. Have it before you need it.",
      closing: `<p>A strong plan has layers, and every layer has a job. Doxy-PEP covers what PrEP doesn't. Testing tells you whether the plan is working. Add the layer before 1 a.m. asks for it.</p>`
    },
    {
      slug: "the-parent-email",
      title: "The parent email: when a family objects",
      audience: "educator", date: "2026-10-16", hero: "parentemail",
      heroAlt: "An envelope on a slate blueprint grid, with four reply steps: acknowledge, invite, clarify, confirm.",
      excerpt: "A parent emails at 7:52 p.m. the night before your consent lesson. What to send back, what not to argue, and who to loop in.",
      hookTime: "7:52 p.m.",
      hook: `
<p>Tomorrow is the FRIES consent lesson. Your inbox pings.</p>
<blockquote>"I don't want my daughter learning about consent 'menus.' That's not appropriate for a 7th grader, and nobody asked me."</blockquote>
<p>It's late, you're tired, and the reply you want to send is a defense. What you send in the next 24 hours decides whether this parent becomes a partner or a complaint.</p>`,
      pivot: "Facilitator protocol",
      body: `
<h2>Name your Ghosts</h2>
<ul>
<li><b>Defense:</b> "I have to prove I'm right." You're not in a debate. You're opening a door.</li>
<li><b>Losing the Room:</b> "If one family objects, the whole program ends." One concern, handled well, builds trust with the rest.</li>
<li><b>Going It Alone:</b> "I'll sort this out myself." Your administrator needs to know, every time.</li>
<li><b>Rewriting the Lesson:</b> "I'll quietly change it to keep the peace." Fidelity protects you, the students, and the site.</li>
</ul>
<h2>The reply, step by step</h2>
<ol>
<li><b>Acknowledge, within one school day.</b> Thank them before anything else.<blockquote>"Thank you for reaching out. You're the most important adult in your child's health education, and I want you to see exactly what we teach."</blockquote></li>
<li><b>Invite a preview.</b> Offer the parent preview materials and a time to talk, with your administrator included.<blockquote>"I'd love to walk you through tomorrow's lesson. Could we meet with [administrator] this week?"</blockquote></li>
<li><b>Clarify what the lesson is, in plain words.</b> Don't defend it, describe it.<blockquote>"In grades 6–8, we use FRIES for everyday situations like secrets, photos, and late-night texts. There's no sexual content in the Green Track."</blockquote></li>
<li><b>Confirm their choice.</b> Families decide on participation. Point them to the consent form and the alternative assignment.<blockquote>"If you decide your daughter won't take part, she'll have an alternative assignment, with no penalty."</blockquote></li>
</ol>
<div class="callout"><p style="margin:0"><b>Consent note:</b> CAPE's standard is a parent's written consent before a student takes part, and families can review the materials first. Follow your district's current notice process and SHAC guidance too.</p></div>
<h2>Say this, not that</h2>
<ul>
<li>Not "This is required by the state." Say "Here's what we teach, and here's how you can see it."</li>
<li>Not "Every other parent is fine with it." Say "Your questions matter. Let's look at it together."</li>
<li>Not a long reply defending the curriculum. Say "Can we talk this week?"</li>
<li>Not "I'll make an exception." Say "Here are your options," and point to consent and the alternative assignment.</li>
</ul>
<h2>Before you hit send</h2>
<ul>
<li><b>Loop in your administrator</b> and forward the parent's email.</li>
<li><b>Keep your reply short.</b> Three to five sentences. Save the details for the meeting.</li>
<li><b>Document it:</b> the date, the concern, your reply, and the outcome.</li>
<li><b>Don't discuss the student</b> or the parent with other families or students.</li>
</ul>
<h2>Why it's in certification</h2>
<p>Parent objection to FRIES is one of the five live scenarios in the CAPE facilitator assessment. Parents who see the materials up front are far more likely to become your strongest supporters.</p>
<p><i>This is educational guidance, not legal advice. Follow your district or host-site policy and your certification training.</i></p>`,
      takeaway: "Acknowledge, invite, clarify, confirm their choice, and loop in your administrator.",
      closing: `<p>Every family objection is a chance to show the curriculum holds up in daylight. Reply calmly, open the door, and let the materials speak.</p>`,
      reflect: "What's the one sentence you'd want to send first, before anything else?",
      reflectNote: "Draft your reply template with your co-facilitator now, before the first email arrives."
    },
    {
      slug: "the-1258-text",
      title: "The 12:58 Text",
      audience: "youth", date: "2026-10-11", hero: "midnight",
      heroAlt: "A phone at 12:58 a.m. showing a message asking for a pic, with a 3-2-1 countdown, over a compass on graph paper.",
      excerpt: "Someone you like asks for a pic after midnight. Three seconds, three gates, and one practiced line keep you the pilot.",
      hookTime: "12:58 a.m.",
      hook: `
<p>The house is dark. Your phone lights up, and it's someone you've been talking to for two weeks. Someone you actually like.</p>
<blockquote>"u up? send me a pic. just for me. i'll delete it, promise."</blockquote>
<p>Your heart does something weird. You want them to keep liking you, and saying no feels like it could end everything. Good advice is easy at 2 p.m. This post is built for 12:58.</p>`,
      pivot: "CAPE Decision GPS",
      body: `
<h2>Name the Ghost</h2>
<p>The pressure isn't really about a photo. It's a Ghost: a fear that makes a bad choice feel urgent. Name it and it loses its grip.</p>
<ul>
<li><b>Rejection:</b> "If you say no, they'll leave." Someone who leaves over a boundary was never on your team.</li>
<li><b>Urgency:</b> "Decide right now." Real respect can wait until morning. Pressure can't, and that's how you spot it.</li>
<li><b>The Promise:</b> "I'll delete it." Screenshots, backups and forwards last forever. Nobody can promise delete.</li>
<li><b>Secrecy:</b> "Don't tell anyone." Healthy connections don't need secrets.</li>
</ul>
<h2>Run the 3-Second Rule</h2>
<p>Before anything leaves your phone, take three seconds and walk it through three gates.</p>
<ol>
<li><b>Legacy Check:</b> Would you, five years from now, be proud this exists?</li>
<li><b>Billboard Check:</b> Would you be okay if it ended up on a billboard on I-45 with your name under it?</li>
<li><b>FRIES Consent Check:</b> Is your yes Freely given, Reversible, Informed, Enthusiastic and Specific?</li>
</ol>
<div class="callout"><p style="margin:0"><b>The rule:</b> any "not sure" at any gate means don't send. A photo fails Reversible every single time.</p></div>
<h2>Say it in one line</h2>
<p>You don't need a speech. You need one line you've already practiced.</p>
<ul>
<li>"Nah, I don't send pics. Talk tomorrow?"</li>
<li>"Not doing that. But I'll FaceTime you after school."</li>
<li>"That's a Do Not Serve for me. Not changing."</li>
<li>"If you actually like me, you'll drop it."</li>
</ul>
<p>Then put the phone face-down. You don't owe anyone a debate at 1 a.m.</p>
<blockquote>Someone who keeps asking after a no is showing you a red flag, not their feelings.</blockquote>
<h2>Check your MATCH Compass</h2>
<ul>
<li><b>Health Armor:</b> your peace of mind is health too.</li>
<li><b>Built-In Radar:</b> rushed, secret and "delete it" are three warning signs in one text.</li>
<li><b>Safety Kit:</b> know which of your 3–5 trusted adults you'd text if this gets weird.</li>
<li><b>Strongest Voice:</b> use your script. One line. Done.</li>
<li><b>Daily Superpower:</b> charge your phone outside your room after midnight.</li>
</ul>
<h2>If it already happened</h2>
<p>Maybe you already sent something, or it's been shared. You are not alone, and a mistake doesn't erase your CAPE.</p>
<ol>
<li><b>Stop the chain.</b> Don't send anything else, and don't forward anything you receive.</li>
<li><b>Tell one trusted adult.</b> Some adults, like school staff, are required to report certain things. That's there to protect you, not punish you.</li>
<li><b>Get it taken down.</b> If you were under 18 in the image, <a href="https://takeitdown.ncmec.org">Take It Down</a> helps remove it from participating platforms without you sending the image to anyone.</li>
<li><b>Report threats.</b> If someone threatens to share it unless you send more, that's a crime. Report it to the <a href="https://report.cybertip.org">CyberTipline</a> or call 1-800-843-5678.</li>
</ol>
<div class="callout"><p style="margin:0"><b>If the person asking is an adult:</b> stop replying, screenshot the messages, and tell a trusted adult right away. It is never okay and never your fault.</p></div>`,
      takeaway: "Three seconds, three gates. Any “not sure” means don’t send.",
      closing: `<p>Pressure is built to make you move fast. Your CAPE is the pause that lets you choose. You were always the pilot.</p>`,
      reflect: "What's the one line you'd send at 12:58? Save it in your Notes app tonight so it's ready.",
      reflectNote: "Families: this mirrors CAPE Lesson 6, The Midnight Text. Ask your teen what they'd say if someone pressured them for a pic, and listen more than you lecture."
    },
    {
      slug: "the-first-60-seconds",
      title: "The First 60 Seconds: when a student discloses mid-lesson",
      audience: "educator", date: "2026-10-11", hero: "firstsixty",
      heroAlt: "A 60-second timeline with five steps: receive, move, be honest, listen, affirm, beside the Certified Facilitator seal.",
      excerpt: "A student discloses abuse in the middle of your lesson. What to say, what not to say, and what you owe them after.",
      hookTime: "10:40 a.m.",
      hook: `
<p>You're 20 minutes into Healthy vs. Unhealthy Relationships, with the red-flags list on the board. A quiet student in the back row raises a hand.</p>
<blockquote>"That's what my mom's boyfriend does. Is that what you mean?"</blockquote>
<p>Thirty faces turn around. Your co-facilitator looks at you. What you do in the next 60 seconds tells that student whether telling an adult was safe.</p>`,
      pivot: "Facilitator protocol",
      body: `
<h2>Name your Ghosts</h2>
<ul>
<li><b>Wrong Words:</b> "I'll make it worse." You don't need perfect words. You need calm, believing, honest ones.</li>
<li><b>Not Sure:</b> "I shouldn't report unless I'm certain." The standard is cause to believe, not proof. Investigating is someone else's job.</li>
<li><b>Trust:</b> "If I report, they'll never trust me." Trust breaks when you promise secrecy and then report.</li>
<li><b>The Room:</b> "Everyone heard that." You can't un-ring it, but you can stop it going further.</li>
</ul>
<h2>The first 60 seconds, word for word</h2>
<ol>
<li><b>0:00 Receive it calmly.</b> Keep your face and voice steady.<blockquote>"Thank you for telling me. That's important."</blockquote></li>
<li><b>0:10 Move it out of the room.</b> Don't ask follow-up questions in front of the class. Your co-facilitator takes over. This is why two adults are always in the room.<blockquote>"I want to give that the attention it deserves. Let's talk, just us, right now."</blockquote></li>
<li><b>0:25 Be honest about confidentiality.</b> Never promise secrecy.<blockquote>"I can't keep this just between us, because my job is to help keep you safe. I'll only tell the people who need to know."</blockquote></li>
<li><b>0:40 Listen, don't interview.</b> One open question at most. No who, what exactly, or how many times. Leading questions can harm the case.<blockquote>"Is there anything else you want me to know right now?"</blockquote></li>
<li><b>0:55 Affirm and explain what's next.</b><blockquote>"This is not your fault. You did the right thing telling me. Next, I'm going to call people whose job is to help kids stay safe."</blockquote></li>
</ol>
<h2>Say this, not that</h2>
<ul>
<li>Not "I promise I won't tell." Say "I can't keep this secret, but I'll only tell people who can help."</li>
<li>Not "Are you sure? Did he really…?" Say "Thank you for telling me."</li>
<li>Not "Why didn't you tell someone sooner?" Say "You did the right thing telling me now."</li>
<li>Not "I'll call your mom and sort this out." Say "I'm going to call people whose job is to help."</li>
</ul>
<h2>What you owe them after</h2>
<div class="callout"><p style="margin:0"><b>Texas law:</b> professionals must report suspected abuse or neglect within 48 hours, personally (Tex. Fam. Code §261.101). Telling your principal does not count as your report.</p></div>
<ul>
<li><b>Write it down now:</b> the student's exact words in quotes, the date, the time, who was present. Facts only.</li>
<li><b>Report it yourself:</b> Texas Abuse Hotline 1-800-252-5400 or <a href="https://www.txabusehotline.org">txabusehotline.org</a>.</li>
<li><b>Follow your site's policy too:</b> notify the administrator as your agreement requires. That's in addition to your report.</li>
<li><b>Don't contact the alleged abuser or the family.</b> That's the investigator's call.</li>
<li><b>Keep it confidential,</b> and debrief with your co-facilitator.</li>
</ul>
<div class="callout"><p style="margin:0"><b>Immediate danger:</b> call 911 first. If the student says they can't safely go home today, don't let them leave without a plan from your administrator or law enforcement.</p></div>
<h2>Why it's non-negotiable in certification</h2>
<p>Abuse disclosure is the first live scenario in the CAPE facilitator assessment, and it's disqualifying if mishandled. It's the one moment a student tests whether the adults in the room can be trusted. The same five moves apply in a HARNESS adult session, though reporting duties for adults differ.</p>
<p><i>This is educational guidance, not legal advice. Follow your district or host-site policy and your certification training.</i></p>`,
      takeaway: "Calm, believe, move it out of the room, and report it yourself within 48 hours.",
      closing: `<p>Panic to a plan applies to the adults in the room too. Practice the five lines until they're automatic, because you won't have time to think.</p>`,
      reflect: "Which of the five lines is hardest for you to say out loud?",
      reflectNote: "Say all five with your co-facilitator before your next session."
    },
    {
      slug: "pep-72-hour-window",
      title: "The 72-hour window: what to know about PEP",
      audience: "adult", date: "2026-09-14", hero: "pep",
      heroAlt: "A glowing 72-hour countdown ring over a starfield, crossed by a heartbeat line.",
      question: "If your primary method of protection fails tonight at 1:00 AM, what is the exact, specific next step you will take?", comments: [],
      excerpt: "A condom broke, a plan fell apart, or you're not sure what happened. PEP can prevent HIV — if you start it in time.",
      hookTime: "1:04 a.m.",
      hook: `
<p>You feel it, or you notice afterward: the condom broke. Your heart is pounding, and your search bar is filling with worst-case results.</p>
<p>Panic says wait until morning and hope. That's the one move that actually costs you.</p>`,
      pivot: "MATCH Framework",
      body: `
<h2>What PEP is</h2>
<p>PEP (post-exposure prophylaxis) is HIV medicine taken after a possible exposure to keep the virus from taking hold. It's a short course, usually 28 days.</p>
<div class="callout"><p style="margin:0"><b>Start within 72 hours.</b> PEP works best the sooner it starts. After 72 hours it's generally not recommended.</p></div>
<h2>Your next three moves</h2>
<ul>
<li><b>Go now.</b> An emergency room is open every hour of every day. Any ER can and should provide PEP — don’t wait for a clinic appointment.</li>
<li><b>Say it plainly.</b> Use the script below.</li>
<li><b>Book follow-up testing</b> before you leave.</li>
</ul>
<blockquote>"I had a possible HIV exposure and I need PEP."</blockquote>
<h2>PEP is a backup, not a plan</h2>
<p>If you've needed PEP more than once, talk with a provider about PrEP — HIV prevention that works before an exposure happens.</p>
<h2>Map it to MATCH</h2>
<ul>
<li><b>Medications:</b> know PEP exists and where the nearest 24-hour ER is.</li>
<li><b>Awareness:</b> schedule follow-up testing.</li>
<li><b>Tools:</b> check condom fit, storage, and expiration dates, and use lube.</li>
<li><b>Communication:</b> tell your partner what happened and what you're doing about it.</li>
<li><b>Habits:</b> save the ER address in your phone today.</li>
</ul>`,
      takeaway: "A failed method isn't a failed plan. The clock is your cue to act, not freeze.",
      closing: `<p>Every protection plan has a failure mode. The people who stay protected aren't the ones who never face 1 a.m. They're the ones who already know their next step.</p>`
    },
    {
      slug: "three-second-rule",
      title: "The 3-Second Rule: a pause before you press send",
      audience: "youth", date: "2026-09-09", hero: "three",
      heroAlt: "A phone with a message ready to send, a three-second pause timer, and a dotted route between two map pins.",
      excerpt: "Screenshots are forever. Three seconds is enough time to check your radar before a message becomes your permanent record.",
      hookTime: "10:52 p.m.",
      hook: `
<p>It's a school night and your phone buzzes. Someone you like sends a message that makes your heart speed up, and they want an answer, or a picture, right now.</p>
<p>That rush of pressure is exactly when your best decisions get skipped.</p>`,
      pivot: "CAPE Decision GPS",
      body: `
<h2>The rule</h2>
<blockquote>Before you send anything, pause for three seconds.</blockquote>
<p>Three seconds sounds small. It's enough time to switch from reacting to deciding.</p>
<h2>Check your compass</h2>
<ul>
<li><b>Built-In Radar:</b> Does this feel rushed, pushy, or secret? Pressure is a warning sign.</li>
<li><b>Daily Superpower:</b> Would I be okay if this was screenshotted and shared? Anything you send can become permanent.</li>
<li><b>Strongest Voice:</b> What do I actually want to say?</li>
</ul>
<h2>A script you can use</h2>
<blockquote>"I'm not sending that. If you respect me, you'll drop it."</blockquote>
<p>You don't owe anyone an explanation. If someone keeps pushing, that tells you something about them. It's also a good moment to talk to a trusted adult.</p>`,
      takeaway: "Three seconds turns a reaction into a decision.",
      closing: `<p>Pressure is designed to make you move fast. Your CAPE is the pause that lets you choose.</p>`,
      reflect: "What's one sentence you could send when someone pressures you to share something you don't want to?",
      reflectNote: "Families: ask your student to teach you the 3-Second Rule tonight. Teaching it back is how it sticks."
    },
    {
      slug: "naming-the-ghosts",
      title: "Naming the Ghosts: why fear is data, not a verdict",
      audience: "adult", date: "2026-09-02", hero: "ghosts",
      heroAlt: "Sixteen labeled fears drawn as signal points, each connected by a line into a glowing MATCH puzzle shield.",
      question: "Which ghost is loudest for you right now, and what is one task you can give it this week?", comments: [],
      excerpt: "Rejection. Cost. Disclosure. The fears we never say out loud are the ones that quietly break our protection plans.",
      hookTime: "12:38 a.m.",
      hook: `
<p>Things are going well. You meant to bring up condoms, or your PrEP, or when you last tested. The words are right there.</p>
<p>Then a voice says <i>if you ask, this ends.</i> So you say nothing, and your plan skips a step you never decided to skip.</p>`,
      pivot: "MATCH Framework",
      body: `
<h2>What a ghost is</h2>
<p>A ghost is a fear that shows up at the worst moment and skips a step in your plan. Fear of rejection skips the condom conversation. Fear of cost skips the clinic visit.</p>
<h2>The 16 ghosts we see most</h2>
<p>Rejection, Cost, Broken Condoms, Disclosure, Judgment, Timing, Pain, Trust, Silence, Past, Future, Comparison, Shame, Access, Body, and Mood-Killer.</p>
<h2>Turn a ghost into a task</h2>
<ol>
<li><b>Name it.</b> Say which ghost is loudest for you.</li>
<li><b>Map it.</b> Match it to the MATCH piece it attacks. Cost usually hits Medications. Rejection usually hits Communication.</li>
<li><b>Give it a task.</b> Cost gets "look up sliding-scale clinics." Rejection gets "write and rehearse one sentence."</li>
</ol>
<blockquote>"Silence is risk. Conversation is protection." — Christopher Zacharie</blockquote>`,
      takeaway: "A fear with a name and a task stops making decisions for you.",
      closing: `<p>Unnamed fear doesn't disappear. It just decides for you. Once a ghost has a name and a task, it's no longer a ghost. It's the next step in your plan.</p>`
    },
    {
      slug: "fries-consent-checks",
      title: "FRIES: five checks for consent that holds up",
      audience: "educator", date: "2026-08-26", hero: "fries",
      heroAlt: "Five tiles spelling FRIES, each lit with a check mark.",
      excerpt: "A single yes isn't the finish line. FRIES gives students and adults five concrete checks they can actually remember.",
      hookTime: "10:15 a.m.",
      hook: `
<p>You've just defined consent. A student raises a hand: <i>"But what if they said yes earlier and now they're not sure?"</i></p>
<p>The room goes quiet, waiting to see if the answer is real. A slogan can't carry that moment. A framework can.</p>`,
      pivot: "MATCH: Communication",
      body: `
<h2>The five checks</h2>
<ul>
<li><b>Freely given:</b> no pressure, guilt, threats, or substances doing the deciding.</li>
<li><b>Reversible:</b> anyone can change their mind at any point.</li>
<li><b>Informed:</b> everyone knows what they're agreeing to.</li>
<li><b>Enthusiastic:</b> look for a real yes, not the absence of a no.</li>
<li><b>Specific:</b> yes to one thing isn't yes to everything.</li>
</ul>
<h2>Practice it, don't lecture it</h2>
<p>In the Consent Café, participants build a boundary menu and role-play asking and answering. Rehearsed words come out under pressure.</p>
<div class="callout"><p style="margin:0"><b>Track note:</b> Green Track (grades 6–8) applies FRIES to everyday situations like secrets, photos, and late-night texts. Keep sexual scenarios to Blue Track and adult sessions.</p></div>
<p>The full Consent Café activity set is in the Educators Hub for certified facilitators.</p>`,
      takeaway: "Rehearsed words come out under pressure. Memorized definitions don't.",
      closing: `<p>Consent isn't one question. It's five checks people can run in real time, if they've practiced them.</p>`,
      reflect: "Which FRIES check is hardest for your participants to practice, and what helps it land?"
    }
  ];

  /* ===== Hero images (inline SVG, no external files) ===== */
  function starsSVG(w, h, n, seed){
    var out = "", s = seed;
    function r(){ s = (s * 9301 + 49297) % 233280; return s / 233280; }
    for (var i=0;i<n;i++){
      var x = (r()*w).toFixed(0), y = (r()*h*0.72).toFixed(0), k = r();
      var c = k > .95 ? "#3ED6E8" : (k > .9 ? "#FFC93C" : "#8C97AE");
      out += '<rect x="' + x + '" y="' + y + '" width="' + (k > .88 ? 3 : 2) + '" height="' + (k > .88 ? 3 : 2) + '" fill="' + c + '"/>';
    }
    return out;
  }
  function floorSVG(color){
    var g = "";
    for (var i=0;i<=16;i++){ var x = -600 + i*150; g += '<line x1="600" y1="470" x2="' + x + '" y2="675" stroke="' + color + '" stroke-width="2"/>'; }
    [490,515,550,600,675].forEach(function(y){ g += '<line x1="0" y1="' + y + '" x2="1200" y2="' + y + '" stroke="' + color + '" stroke-width="2"/>'; });
    return g;
  }
  var HEROES = {
    midnight: function(){
      var grid = '';
      for (var x=0;x<=1200;x+=24) grid += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="675" stroke="#2A9D8F" stroke-opacity="'+(x%120===0?.28:.12)+'" stroke-width="1"/>';
      for (var y=0;y<=675;y+=24) grid += '<line x1="0" y1="'+y+'" x2="1200" y2="'+y+'" stroke="#2A9D8F" stroke-opacity="'+(y%120===0?.28:.12)+'" stroke-width="1"/>';
      return '<rect width="1200" height="675" fill="#F6F1E4"/>' + grid +
        '<circle cx="600" cy="338" r="300" fill="none" stroke="#2A9D8F" stroke-width="2" stroke-dasharray="6 10"/>' +
        '<circle cx="600" cy="338" r="230" fill="none" stroke="#C29B38" stroke-width="2"/>' +
        '<rect x="480" y="70" width="240" height="500" rx="38" fill="#1F2D2B"/><rect x="497" y="100" width="206" height="440" rx="20" fill="#0E1C1A"/>' +
        '<text x="600" y="168" text-anchor="middle" font-family="Space Mono, monospace" font-size="46" font-weight="700" fill="#F6F1E4">12:58</text>' +
        '<rect x="515" y="210" width="172" height="86" rx="16" fill="#E9F4F2"/>' +
        '<text x="530" y="246" font-family="DM Sans, sans-serif" font-size="19" fill="#163F3A">u up? send me</text>' +
        '<text x="530" y="272" font-family="DM Sans, sans-serif" font-size="19" fill="#163F3A">a pic. just for me.</text>' +
        '<rect x="515" y="310" width="150" height="56" rx="16" fill="#E9F4F2"/>' +
        '<text x="530" y="345" font-family="DM Sans, sans-serif" font-size="19" fill="#163F3A">i\'ll delete it.</text>' +
        '<rect x="560" y="420" width="128" height="52" rx="16" fill="#2A9D8F"/>' +
        '<text x="624" y="454" text-anchor="middle" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#F6F1E4">3…2…1</text>' +
        '<image href="/assets/img/247cdc793770.png" x="870" y="330" width="220" height="230"/>' +
        '<text x="80" y="555" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#7E6420" letter-spacing="3">DECISION GPS · LESSON 6</text>';
    },
    firstsixty: function(){
      var grid = '';
      for (var x=0;x<=1200;x+=30) grid += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="675" stroke="#2E3B4A" stroke-opacity=".10" stroke-width="1"/>';
      for (var y=0;y<=675;y+=30) grid += '<line x1="0" y1="'+y+'" x2="1200" y2="'+y+'" stroke="#2E3B4A" stroke-opacity=".10" stroke-width="1"/>';
      var steps = [["0:00","RECEIVE"],["0:10","MOVE"],["0:25","HONEST"],["0:40","LISTEN"],["0:55","AFFIRM"]], g = '';
      steps.forEach(function(s,i){ var x = 90 + i*150;
        g += '<circle cx="'+x+'" cy="430" r="16" fill="'+(i===0?'#A8822C':'#2E3B4A')+'"/>' +
             '<text x="'+x+'" y="395" text-anchor="middle" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#2E3B4A">'+s[0]+'</text>' +
             '<text x="'+x+'" y="478" text-anchor="middle" font-family="Space Mono, monospace" font-size="17" font-weight="700" fill="#4A5767" letter-spacing="1">'+s[1]+'</text>'; });
      return '<rect width="1200" height="675" fill="#E7EBEF"/>' + grid +
        '<text x="80" y="235" font-family="Bebas Neue, Impact, sans-serif" font-size="130" fill="#1C2631">0:00 → 0:60</text>' +
        '<text x="84" y="285" font-family="Space Mono, monospace" font-size="22" font-weight="700" fill="#7C5F1C" letter-spacing="4">FACILITATOR PROTOCOL · DISCLOSURE</text>' +
        '<line x1="90" y1="430" x2="690" y2="430" stroke="#2E3B4A" stroke-width="4"/>' + g +
        '<image href="/assets/img/3388f4a3ffd5.png" x="820" y="170" width="300" height="313"/>';
    },
    ridehome: function(){
      var grid = '';
      for (var x=0;x<=1200;x+=24) grid += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="675" stroke="#2A9D8F" stroke-opacity="'+(x%120===0?.26:.11)+'" stroke-width="1"/>';
      for (var y=0;y<=675;y+=24) grid += '<line x1="0" y1="'+y+'" x2="1200" y2="'+y+'" stroke="#2A9D8F" stroke-opacity="'+(y%120===0?.26:.11)+'" stroke-width="1"/>';
      return '<rect width="1200" height="675" fill="#F6F1E4"/>' + grid +
        '<image href="' + LANE_ART.CREST_YOUTH + '" x="880" y="40" width="240" height="251"/>' +
        '<path d="M120 560 C330 560 360 420 560 430 S900 560 1080 470" fill="none" stroke="#2A9D8F" stroke-width="8" stroke-dasharray="4 22" stroke-linecap="round"/>' +
        '<path d="M120 488c-30 0-52 22-52 50 0 38 52 88 52 88s52-50 52-88c0-28-22-50-52-50z" fill="#A6387E"/><circle cx="120" cy="538" r="17" fill="#fff"/>' +
        '<path d="M1030 470 1080 425 1130 470z" fill="#C29B38"/><rect x="1042" y="470" width="76" height="62" fill="#C29B38"/><rect x="1070" y="498" width="20" height="34" fill="#F6F1E4"/>' +
        '<rect x="420" y="70" width="270" height="470" rx="38" fill="#16324F"/><rect x="436" y="100" width="238" height="410" rx="22" fill="#FFFDF7"/>' +
        '<text x="555" y="160" text-anchor="middle" font-family="Space Mono, monospace" font-size="38" font-weight="700" fill="#16324F">11:36</text>' +
        '<rect x="456" y="200" width="170" height="58" rx="18" fill="#F1E7CF"/><text x="474" y="236" font-family="DM Sans, sans-serif" font-size="22" font-weight="700" fill="#16324F">we good to go?</text>' +
        '<rect x="520" y="282" width="134" height="58" rx="18" fill="#2A9D8F"/><text x="587" y="320" text-anchor="middle" font-family="Space Mono, monospace" font-size="30" font-weight="700" fill="#fff">X</text>' +
        '<text x="652" y="360" text-anchor="end" font-family="Space Mono, monospace" font-size="15" fill="#4E5A66">sent to Mom</text>' +
        '<rect x="456" y="384" width="198" height="58" rx="18" fill="#F1E7CF"/><text x="474" y="420" font-family="DM Sans, sans-serif" font-size="22" font-weight="700" fill="#16324F">on my way. 10 min</text>' +
        '<text x="80" y="120" font-family="Playfair Display, Georgia, serif" font-size="58" font-weight="700" fill="#16324F">Ride Home</text>' +
        '<text x="82" y="160" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#1D6F66" letter-spacing="4">PLAN IT BEFORE YOU GO</text>';
    },
    doxy: function(){
      var bars = [["SYPHILIS","80–87%","#90B14B",0.84],["CHLAMYDIA","87–88%","#6E99A3",0.88],["GONORRHEA","FADED","#FFC93C",0.04]], g = '';
      bars.forEach(function(b,i){ var y = 200 + i*96;
        g += '<text x="700" y="'+(y-12)+'" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#EDEFF4" letter-spacing="3">'+b[0]+'</text>' +
             '<text x="1120" y="'+(y-12)+'" text-anchor="end" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="'+b[2]+'">'+b[1]+(b[1]==='FADED'?'':' LOWER')+'</text>' +
             '<rect x="700" y="'+y+'" width="420" height="20" rx="3" fill="#15223A"/><rect x="700" y="'+y+'" width="'+(420*b[3]).toFixed(0)+'" height="20" rx="3" fill="'+b[2]+'"/>'; });
      return '<rect width="1200" height="675" fill="#05070D"/>' + starsSVG(1200,675,130,31) + floorSVG("#15223A") +
        '<g transform="rotate(-32 330 300)"><rect x="170" y="230" width="320" height="140" rx="70" fill="#0A0F1C" stroke="#3ED6E8" stroke-width="5"/>' +
        '<path d="M240 230h90v140h-90a70 70 0 0 1 0-140z" fill="#FF2E88"/><line x1="330" y1="236" x2="330" y2="364" stroke="#3ED6E8" stroke-width="4"/></g>' +
        '<text x="120" y="540" font-family="Bebas Neue, Impact, sans-serif" font-size="96" fill="#EDEFF4">DOXY-PEP</text>' +
        '<text x="124" y="580" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#FFC93C" letter-spacing="4">WITHIN 72 HOURS · 200 MG</text>' + g +
        '<text x="700" y="120" font-family="Space Mono, monospace" font-size="18" font-weight="700" fill="#A9B3C7" letter-spacing="4">WHAT IT LOWERS</text>' +
        '<image href="' + LANE_ART.CREST_ADULT + '" x="800" y="462" width="350" height="171"/>';
    },
    parentemail: function(){
      var grid = '';
      for (var x=0;x<=1200;x+=30) grid += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="675" stroke="#2E3B4A" stroke-opacity=".10" stroke-width="1"/>';
      for (var y=0;y<=675;y+=30) grid += '<line x1="0" y1="'+y+'" x2="1200" y2="'+y+'" stroke="#2E3B4A" stroke-opacity=".10" stroke-width="1"/>';
      var steps = ["ACKNOWLEDGE","INVITE","CLARIFY","CONFIRM"], g = '';
      steps.forEach(function(s,i){ var y = 180 + i*100;
        g += '<rect x="700" y="'+(y-40)+'" width="400" height="66" rx="4" fill="#F4F6F8" stroke="#2E3B4A" stroke-width="2"/>' +
             '<rect x="700" y="'+(y-40)+'" width="66" height="66" fill="'+(i===0?'#A8822C':'#2E3B4A')+'"/>' +
             '<text x="733" y="'+(y+5)+'" text-anchor="middle" font-family="Bebas Neue, Impact, sans-serif" font-size="40" fill="#F4F6F8">'+(i+1)+'</text>' +
             '<text x="790" y="'+(y+3)+'" font-family="Space Mono, monospace" font-size="24" font-weight="700" fill="#1C2631" letter-spacing="2">'+s+'</text>'; });
      return '<rect width="1200" height="675" fill="#E7EBEF"/>' + grid +
        '<rect x="110" y="200" width="460" height="300" rx="6" fill="#F4F6F8" stroke="#2E3B4A" stroke-width="4"/>' +
        '<path d="M110 206 340 380 570 206" fill="none" stroke="#2E3B4A" stroke-width="4" stroke-linejoin="round"/>' +
        '<image href="' + LANE_ART.SEAL_EDU + '" x="440" y="360" width="170" height="177"/>' +
        '<text x="110" y="140" font-family="Bebas Neue, Impact, sans-serif" font-size="72" fill="#1C2631">THE PARENT EMAIL</text>' +
        '<text x="112" y="560" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#7C5F1C" letter-spacing="4">REPLY WITHIN ONE SCHOOL DAY</text>' + g;
    },
    dinner: function(){
      var grid = '';
      for (var x=0;x<=1200;x+=24) grid += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="675" stroke="#2A9D8F" stroke-opacity="'+(x%120===0?.24:.10)+'" stroke-width="1"/>';
      for (var y=0;y<=675;y+=24) grid += '<line x1="0" y1="'+y+'" x2="1200" y2="'+y+'" stroke="#2A9D8F" stroke-opacity="'+(y%120===0?.24:.10)+'" stroke-width="1"/>';
      function plate(x,y){ return '<circle cx="'+x+'" cy="'+y+'" r="62" fill="#FFFDF7" stroke="#C9B98F" stroke-width="3"/><circle cx="'+x+'" cy="'+y+'" r="42" fill="none" stroke="#E6D9B8" stroke-width="3"/>'; }
      return '<rect width="1200" height="675" fill="#F6F1E4"/>' + grid +
        '<ellipse cx="450" cy="390" rx="330" ry="200" fill="#E9DCC0" stroke="#16324F" stroke-width="5"/>' +
        plate(290,400) + plate(610,380) +
        '<rect x="90" y="120" width="420" height="76" rx="22" fill="#2A9D8F"/><path d="M220 196 205 232 252 196z" fill="#2A9D8F"/>' +
        '<text x="300" y="167" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="24" font-weight="700" fill="#FFFDF7">we learned about boundaries</text>' +
        '<rect x="440" y="560" width="360" height="76" rx="22" fill="#16324F"/><path d="M610 560 625 524 578 560z" fill="#16324F"/>' +
        '<text x="620" y="607" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="24" font-weight="700" fill="#FFFDF7">what stood out to you?</text>' +
        '<image href="' + LANE_ART.CREST_PARENT + '" x="870" y="116" width="260" height="234"/>' +
        '<text x="1000" y="430" text-anchor="middle" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#7A5E17" letter-spacing="4">AT THE TABLE</text>' +
        '<text x="1000" y="462" text-anchor="middle" font-family="Space Mono, monospace" font-size="16" fill="#4E5A66" letter-spacing="2">ASK ONE · LISTEN TWICE</text>';
    },
    costghost: function(){
      return '<rect width="1200" height="675" fill="#05070D"/>' + starsSVG(1200,675,130,47) + floorSVG("#15223A") +
        '<g transform="rotate(-6 330 300)"><path d="M180 90h300v400l-25-18-25 18-25-18-25 18-25-18-25 18-25-18-25 18-25-18-25 18-25-18-25 18z" fill="#0A0F1C" stroke="#3ED6E8" stroke-width="4"/>' +
        '<text x="330" y="150" text-anchor="middle" font-family="Space Mono, monospace" font-size="22" font-weight="700" fill="#A9B3C7" letter-spacing="4">PHARMACY</text>' +
        '<line x1="210" y1="175" x2="450" y2="175" stroke="#15223A" stroke-width="3" stroke-dasharray="6 6"/>' +
        '<text x="212" y="230" font-family="Space Mono, monospace" font-size="22" fill="#EDEFF4">PrEP, 30 days</text>' +
        '<text x="450" y="300" text-anchor="end" font-family="Bebas Neue, Impact, sans-serif" font-size="72" fill="#FF2E88">$$$</text>' +
        '<line x1="300" y1="250" x2="460" y2="310" stroke="#FF2E88" stroke-width="7" stroke-linecap="round"/>' +
        '<text x="212" y="355" font-family="Space Mono, monospace" font-size="22" fill="#90B14B">CHECK FIRST</text>' +
        '<text x="450" y="445" text-anchor="end" font-family="Bebas Neue, Impact, sans-serif" font-size="72" fill="#3ED6E8">$0?</text></g>' +
        '<text x="640" y="170" font-family="Bebas Neue, Impact, sans-serif" font-size="104" fill="#EDEFF4">THE COST</text>' +
        '<text x="640" y="270" font-family="Bebas Neue, Impact, sans-serif" font-size="104" fill="#FFC93C">GHOST</text>' +
        '<text x="644" y="320" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#A9B3C7" letter-spacing="4">CALL BEFORE YOU SKIP</text>' +
        '<image href="' + LANE_ART.CREST_ADULT + '" x="800" y="462" width="350" height="171"/>';
    },
    groupchat: function(){
      var grid = '';
      for (var x=0;x<=1200;x+=24) grid += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="675" stroke="#2A9D8F" stroke-opacity="'+(x%120===0?.26:.11)+'" stroke-width="1"/>';
      for (var y=0;y<=675;y+=24) grid += '<line x1="0" y1="'+y+'" x2="1200" y2="'+y+'" stroke="#2A9D8F" stroke-opacity="'+(y%120===0?.26:.11)+'" stroke-width="1"/>';
      var reacts = '';
      for (var i=0;i<5;i++) reacts += '<circle cx="'+(474+i*36)+'" cy="372" r="15" fill="#FFC93C" stroke="#16324F" stroke-width="2"/><path d="M'+(466+i*36)+' 375q8 8 16 0" fill="none" stroke="#16324F" stroke-width="2.5" stroke-linecap="round"/>';
      return '<rect width="1200" height="675" fill="#F6F1E4"/>' + grid +
        '<rect x="420" y="70" width="270" height="520" rx="38" fill="#16324F"/><rect x="436" y="100" width="238" height="460" rx="22" fill="#FFFDF7"/>' +
        '<text x="555" y="150" text-anchor="middle" font-family="Space Mono, monospace" font-size="34" font-weight="700" fill="#16324F">9:47</text>' +
        '<text x="555" y="178" text-anchor="middle" font-family="Space Mono, monospace" font-size="14" fill="#4E5A66">the group (14)</text>' +
        '<rect x="456" y="200" width="198" height="140" rx="14" fill="#E6D9B8"/>' +
        '<rect x="474" y="222" width="160" height="14" rx="7" fill="#C9B98F"/><rect x="474" y="248" width="120" height="14" rx="7" fill="#C9B98F"/><rect x="474" y="274" width="146" height="14" rx="7" fill="#C9B98F"/><rect x="474" y="300" width="96" height="14" rx="7" fill="#C9B98F"/>' +
        reacts +
        '<rect x="456" y="406" width="198" height="54" rx="18" fill="#F1E7CF"/><text x="472" y="440" font-family="DM Sans, sans-serif" font-size="19" font-weight="700" fill="#16324F">forward this 💀</text>' +
        '<rect x="480" y="484" width="150" height="54" rx="27" fill="#A6387E"/><text x="555" y="518" text-anchor="middle" font-family="Space Mono, monospace" font-size="18" font-weight="700" fill="#fff">FORWARD</text>' +
        '<line x1="490" y1="530" x2="620" y2="492" stroke="#16324F" stroke-width="6" stroke-linecap="round"/>' +
        '<text x="80" y="140" font-family="Playfair Display, Georgia, serif" font-size="56" font-weight="700" fill="#16324F">Not yours</text>' +
        '<text x="80" y="204" font-family="Playfair Display, Georgia, serif" font-size="56" font-weight="700" fill="#16324F">to share</text>' +
        '<text x="82" y="248" font-family="Space Mono, monospace" font-size="18" font-weight="700" fill="#1D6F66" letter-spacing="3">BYSTANDER → UPSTANDER</text>' +
        '<image href="' + LANE_ART.CREST_YOUTH + '" x="880" y="40" width="240" height="251"/>' +
        '<text x="1000" y="360" text-anchor="middle" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#1D6F66" letter-spacing="4">THE BOUNDARY SHIELD</text>';
    },
    phoneplan: function(){
      var grid = '';
      for (var x=0;x<=1200;x+=24) grid += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="675" stroke="#2A9D8F" stroke-opacity="'+(x%120===0?.24:.10)+'" stroke-width="1"/>';
      for (var y=0;y<=675;y+=24) grid += '<line x1="0" y1="'+y+'" x2="1200" y2="'+y+'" stroke="#2A9D8F" stroke-opacity="'+(y%120===0?.24:.10)+'" stroke-width="1"/>';
      function phone(x,c){ return '<rect x="'+x+'" y="300" width="80" height="150" rx="14" fill="#16324F"/><rect x="'+(x+8)+'" y="314" width="64" height="118" rx="6" fill="'+c+'"/><path d="M'+(x+40)+' 450v40" stroke="#16324F" stroke-width="4"/>'; }
      return '<rect width="1200" height="675" fill="#F6F1E4"/>' + grid +
        '<rect x="70" y="490" width="720" height="40" rx="6" fill="#E9DCC0" stroke="#16324F" stroke-width="5"/>' +
        '<rect x="110" y="480" width="560" height="14" rx="4" fill="#C9B98F"/>' +
        phone(130,'#2A9D8F') + phone(250,'#2A9D8F') + phone(370,'#2A9D8F') + phone(490,'#2A9D8F') +
        '<g transform="rotate(4 690 260)"><rect x="600" y="150" width="200" height="200" fill="#FFE58A" stroke="#C29B38" stroke-width="2"/>' +
        '<text x="620" y="196" font-family="Caveat, Segoe Print, cursive" font-size="30" font-weight="700" fill="#16324F">Phones sleep</text>' +
        '<text x="620" y="236" font-family="Caveat, Segoe Print, cursive" font-size="30" font-weight="700" fill="#16324F">here at 10:30</text>' +
        '<text x="620" y="286" font-family="Caveat, Segoe Print, cursive" font-size="26" fill="#A6387E">everyone. us too.</text>' +
        '<text x="620" y="326" font-family="Caveat, Segoe Print, cursive" font-size="22" fill="#4E5A66">check in: 1 month</text></g>' +
        '<text x="80" y="130" font-family="Playfair Display, Georgia, serif" font-size="58" font-weight="700" fill="#16324F">The Phone Plan</text>' +
        '<text x="82" y="172" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#7A5E17" letter-spacing="4">MADE TOGETHER</text>' +
        '<image href="' + LANE_ART.CREST_PARENT + '" x="870" y="116" width="260" height="234"/>' +
        '<text x="1000" y="430" text-anchor="middle" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#7A5E17" letter-spacing="4">AFTER 10:30 P.M.</text>';
    },
    trackgate: function(){
      var grid = '';
      for (var x=0;x<=1200;x+=30) grid += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="675" stroke="#2E3B4A" stroke-opacity=".10" stroke-width="1"/>';
      for (var y=0;y<=675;y+=30) grid += '<line x1="0" y1="'+y+'" x2="1200" y2="'+y+'" stroke="#2E3B4A" stroke-opacity=".10" stroke-width="1"/>';
      return '<rect width="1200" height="675" fill="#E7EBEF"/>' + grid +
        '<g transform="translate(0 85)">' +
        '<rect x="110" y="250" width="420" height="70" fill="#90B14B" fill-opacity=".85"/>' +
        '<text x="130" y="296" font-family="Space Mono, monospace" font-size="22" font-weight="700" fill="#1C2631" letter-spacing="3">GREEN · 6–8</text>' +
        '<rect x="530" y="230" width="22" height="110" fill="#2E3B4A"/><rect x="552" y="230" width="22" height="110" fill="#2E3B4A"/>' +
        '<rect x="590" y="262" width="54" height="46" rx="6" fill="#A8822C"/><path d="M600 262v-16a17 17 0 0 1 34 0v16" fill="none" stroke="#A8822C" stroke-width="7"/>' +
        '<rect x="110" y="380" width="1000" height="70" fill="#2E6FA8" fill-opacity=".85"/>' +
        '<text x="130" y="426" font-family="Space Mono, monospace" font-size="22" font-weight="700" fill="#F4F6F8" letter-spacing="3">BLUE · 9–12 · PARTS 3 &amp; 5 WITH SITE APPROVAL</text>' +
        '<path d="M1080 395l30 20-30 20" fill="none" stroke="#F4F6F8" stroke-width="5"/>' +
        '<text x="110" y="150" font-family="Bebas Neue, Impact, sans-serif" font-size="84" fill="#1C2631">TRACK INTEGRITY</text>' +
        '<text x="112" y="196" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#7C5F1C" letter-spacing="4">THE GATE STAYS CLOSED</text>' +
        '<image href="' + LANE_ART.SEAL_EDU + '" x="940" y="60" width="170" height="177"/>' +
        '</g>';
    },
    pep: function(){
      var ticks = "";
      for (var i=0;i<72;i++){
        var a = (i/72)*Math.PI*2 - Math.PI/2, r1 = 170, r2 = i%6===0 ? 205 : 192;
        var col = i < 54 ? "#3ED6E8" : (i < 66 ? "#FFC93C" : "#FF2E88");
        ticks += '<line x1="' + (600+Math.cos(a)*r1).toFixed(1) + '" y1="' + (300+Math.sin(a)*r1).toFixed(1) + '" x2="' + (600+Math.cos(a)*r2).toFixed(1) + '" y2="' + (300+Math.sin(a)*r2).toFixed(1) + '" stroke="' + col + '" stroke-width="' + (i%6===0?6:4) + '" stroke-linecap="round"/>';
      }
      return '<rect width="1200" height="675" fill="#05070D"/>' + starsSVG(1200,675,140,11) + floorSVG("#15223A") +
        '<polyline points="0,300 330,300 360,300 385,240 415,370 445,270 470,300 1200,300" fill="none" stroke="#FF2E88" stroke-width="5" stroke-linejoin="round"/>' +
        '<circle cx="600" cy="300" r="222" fill="#05070D" stroke="#26344F" stroke-width="2"/>' + ticks +
        '<circle cx="600" cy="300" r="150" fill="#0A0F1C" stroke="#26344F" stroke-width="2"/>' +
        '<text x="600" y="345" text-anchor="middle" font-family="Bebas Neue, Impact, sans-serif" font-size="150" fill="#EDEFF4">72</text>' +
        '<text x="600" y="385" text-anchor="middle" font-family="Space Mono, monospace" font-size="24" font-weight="700" fill="#FFC93C" letter-spacing="6">HOURS</text>' +
        '<polyline points="822,300 860,300 885,250 915,360 945,280 965,300 1200,300" fill="none" stroke="#3ED6E8" stroke-width="5" stroke-linejoin="round"/>';
    },
    ghosts: function(){
      var labels = ["REJECTION","COST","BROKEN CONDOMS","DISCLOSURE","JUDGMENT","TIMING","PAIN","TRUST","SILENCE","PAST","FUTURE","COMPARISON","SHAME","ACCESS","BODY","MOOD-KILLER"];
      var cols = ["#A8005D","#90B14B","#A8005D","#DFC401","#DFC401","#FF751F","#A8005D","#DFC401","#DFC401","#6E99A3","#FF751F","#6E99A3","#6E99A3","#90B14B","#6E99A3","#DFC401"];
      var g = "";
      labels.forEach(function(t,i){
        var col = i % 2, row = Math.floor(i/2), x = 70 + col*250 + (row%2)*40, y = 70 + row*72;
        var w = t.length*13 + 34;
        g += '<line x1="' + (x+w) + '" y1="' + (y+20) + '" x2="880" y2="330" stroke="' + cols[i] + '" stroke-width="2"/>';
        g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="40" rx="4" fill="#101A2E" stroke="' + cols[i] + '" stroke-width="2"/>';
        g += '<text x="' + (x+17) + '" y="' + (y+27) + '" font-family="Space Mono, monospace" font-size="18" font-weight="700" fill="#EDEFF4">' + t + '</text>';
      });
      return '<rect width="1200" height="675" fill="#05070D"/>' + starsSVG(1200,675,110,23) + g +
        '<path d="M880 110 1070 180v150c0 118-86 196-190 224C776 526 690 448 690 330V180z" fill="#0A0F1C" stroke="#EDEFF4" stroke-width="5"/>' +
        '<path d="M880 128V330H708V190z" fill="#90B14B"/><path d="M880 128V330h172V190z" fill="#6E99A3"/>' +
        '<path d="M708 330h172v206c-96-30-172-104-172-206z" fill="#A8005D"/><path d="M1052 330H880v206c96-30 172-104 172-206z" fill="#DFC401"/>' +
        '<circle cx="880" cy="330" r="58" fill="#FF751F" stroke="#05070D" stroke-width="14"/>' +
        '<text x="880" y="352" text-anchor="middle" font-family="Bebas Neue, Impact, sans-serif" font-size="64" fill="#05070D">H</text>';
    },
    three: function(){
      var grid = ''; for (var gx=0; gx<=1200; gx+=30) grid += '<line x1="'+gx+'" y1="0" x2="'+gx+'" y2="675" stroke="'+(gx%150===0?'#E3D8BF':'#EFE8D7')+'" stroke-width="'+(gx%150===0?2:1)+'"/>';
      for (var gy=0; gy<=675; gy+=30) grid += '<line x1="0" y1="'+gy+'" x2="1200" y2="'+gy+'" stroke="'+(gy%150===0?'#E3D8BF':'#EFE8D7')+'" stroke-width="'+(gy%150===0?2:1)+'"/>';
      return '<rect width="1200" height="675" fill="#FAF6EC"/>' + grid +
        '<circle cx="1060" cy="110" r="150" fill="none" stroke="#CFE3DE" stroke-width="2"/><circle cx="1060" cy="110" r="100" fill="none" stroke="#E6D9B8" stroke-width="2" stroke-dasharray="4 8"/>' +
        '<path d="M80 560 C300 560 320 420 520 430 S860 600 1120 470" fill="none" stroke="#2A9D8F" stroke-width="8" stroke-dasharray="4 22" stroke-linecap="round"/>' +
        '<circle cx="80" cy="560" r="22" fill="#2A9D8F"/><circle cx="80" cy="560" r="9" fill="#fff"/>' +
        '<path d="M1120 400c-30 0-52 22-52 50 0 38 52 88 52 88s52-50 52-88c0-28-22-50-52-50z" fill="#C29B38"/><circle cx="1120" cy="450" r="17" fill="#fff"/>' +
        '<rect x="300" y="70" width="290" height="520" rx="40" fill="#16324F"/><rect x="316" y="100" width="258" height="460" rx="24" fill="#FFFDF7"/>' +
        '<rect x="340" y="140" width="190" height="64" rx="18" fill="#F1E7CF"/><rect x="360" y="162" width="140" height="10" rx="5" fill="#9AA6B8"/><rect x="360" y="182" width="90" height="10" rx="5" fill="#9AA6B8"/>' +
        '<rect x="360" y="226" width="190" height="52" rx="18" fill="#F1E7CF"/><rect x="380" y="246" width="120" height="10" rx="5" fill="#9AA6B8"/>' +
        '<rect x="340" y="480" width="170" height="50" rx="25" fill="#F1F4F9" stroke="#DCE3EE" stroke-width="2"/>' +
        '<circle cx="540" cy="505" r="26" fill="#A6387E"/><path d="M530 492 555 505 530 518z" fill="#fff"/>' +
        '<circle cx="820" cy="250" r="150" fill="#FFFDF7" stroke="#2A9D8F" stroke-width="4"/>' +
        '<circle cx="820" cy="250" r="118" fill="none" stroke="#F1E7CF" stroke-width="22"/>' +
        '<path d="M820 132 A118 118 0 1 1 717.8 309" fill="none" stroke="#2A9D8F" stroke-width="22" stroke-linecap="round"/>' +
        '<text x="820" y="300" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="150" fill="#16324F">3</text>' +
        '<text x="820" y="440" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="26" fill="#7A5E17" letter-spacing="4">PAUSE</text>';
    },
    fries: function(){
      var letters = ["F","R","I","E","S"], g = "";
      letters.forEach(function(l,i){
        var x = 110 + i*206;
        g += '<rect x="' + x + '" y="170" width="170" height="250" rx="6" fill="#101A2E" stroke="#26344F" stroke-width="3"/>';
        g += '<rect x="' + x + '" y="170" width="170" height="8" fill="#FFC93C"/>';
        g += '<text x="' + (x+85) + '" y="345" text-anchor="middle" font-family="Bebas Neue, Impact, sans-serif" font-size="170" fill="#FFC93C">' + l + '</text>';
        g += '<circle cx="' + (x+85) + '" cy="480" r="34" fill="#90B14B"/><path d="M' + (x+68) + ' 481l12 12 24-26" fill="none" stroke="#05070D" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>';
      });
      return '<rect width="1200" height="675" fill="#16223A"/>' +
        '<rect x="0" y="600" width="1200" height="75" fill="#0E1626"/>' + g +
        '<text x="600" y="110" text-anchor="middle" font-family="Space Mono, monospace" font-size="26" font-weight="700" fill="#A9B3C7" letter-spacing="6">FIVE CHECKS</text>';
    }
  };
  function heroSVG(p, decorative){
    var fn = HEROES[p.hero]; if (!fn) return "";
    return '<svg class="hero-svg" viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice" ' +
      (decorative ? 'aria-hidden="true" focusable="false"' : 'role="img" aria-label="' + esc(p.heroAlt || p.title) + '"') + '>' + fn() + '</svg>';
  }
  var AUD = { adult: "Adults", youth: "Youth & families", parent: "Parents & caregivers", educator: "Educators" };
  var AUTHOR = { name: "Christopher Zacharie", initials: "CZ", photo: (document.getElementById("author-photo") || {}).src || "", role: "Founder, The HARNESS Project LLC",
    bio: "Sexual health educator, curriculum developer, and Certified HIV Prevention Specialist with 13 years of classroom teaching experience. Author of MATCH Your Protection and CAPE Youth Edition." };
  var BRAVE_IMG = "/assets/img/207864e9ed44.webp";
  POSTS.forEach(function(p){
    var words = [p.hook, p.body, p.takeaway, p.closing, p.question || p.reflect].join(" ").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
    p.minutes = Math.max(1, Math.ceil(words / 200));
  });
  function avatarHTML(){ return AUTHOR.photo ? '<span class="avatar has-photo" aria-hidden="true"><img src="' + AUTHOR.photo + '" alt=""></span>' : '<span class="avatar" aria-hidden="true">' + AUTHOR.initials + '</span>'; }
  function metaLine(p){ return 'By ' + AUTHOR.name + ' — ' + fmtDate(p.date) + ' — ' + p.minutes + ' min read'; }

  var RULES = [
    ["Confidentiality", "What is shared here, stays here. Protect every voice in this space."],
    ["\u201CI\u201D statements", "Speak from your own experience only. Use \u201CI feel\u2026\u201D not \u201CYou should\u2026\u201D"],
    ["Right to pass", "You may skip any question or activity without explanation."],
    ["No judgment", "All questions are valid, and all identities are welcome here."],
    ["Brave space", "Commit to honesty, even when it feels uncomfortable."],
    ["Step up / step back", "Balance the conversation \u2014 make space and take space."]
  ];
  var LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  var UNLOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  function braveSpaceHTML(p){
    var comments = (p.comments || []).slice().sort(function(a,b){ return a.date < b.date ? -1 : 1; });
    return '<section class="brave" aria-labelledby="brave-h">' +
      '<h2 class="brave-title" id="brave-h">Join the conversation</h2>' +
      '<figure><img src="' + BRAVE_IMG + '" width="686" height="364" alt="The HARNESS Brave Space Comment Guidelines: moving from anxiety to agency. Honesty over comfort, pause before replying, speak from your own experience, and share tools, not prescriptions."></figure>' +
      '<details><summary>Read the guidelines as text</summary><div class="g-text">' +
        '<div><b>Honesty over comfort</b><span>We aim for growth that happens at the edge of your comfort zone; prioritize truthful engagement to foster real-world resilience.</span></div>' +
        '<div><b>Pause before replying</b><span>Before responding to a heated comment, take a breath to protect the community from reactive, cortisol-driven friction.</span></div>' +
        '<div><b>Speak from your own experience</b><span>Use status-neutral language to ensure all voices are heard without hierarchy or clinical bias.</span></div>' +
        '<div><b>Share tools, not prescriptions</b><span>Focus on sharing tactical tools and pointing back to the MATCH framework rather than giving medical advice.</span></div>' +
      '</div></details>' +
      (p.question ? '<div class="todays-q"><h3>Today\u2019s question</h3><p>' + esc(p.question) + '</p></div>' : '') +
      (comments.length ? '' : '<details class="brave-join"><summary class="btn btn-gold">Answer today\u2019s question</summary>') +
      '<div class="rules-panel">' +
        '<div class="rules-top"><h3><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 20 5v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" fill="none" stroke="#FF2E88" stroke-width="2"/><path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="#FF2E88" stroke-width="2"/></svg>Brave Space ground rules</h3>' +
        '<span class="remaining" aria-live="polite">' + LOCK + '<span class="rem-n">' + RULES.length + ' remaining</span></span></div>' +
        '<p class="rules-intro"><b>The 3-Second Rule is in effect.</b> Read and check each rule before you post. This is not a formality \u2014 it is a biological circuit breaker that interrupts reactive impulses and ensures you enter this space intentionally.</p>' +
        '<ul class="rule-list">' + RULES.map(function(r,i){
          return '<li><label><input type="checkbox" class="rule-cb" id="rule-' + i + '"><span><b>' + r[0] + '</b><span>' + r[1] + '</span></span></label></li>';
        }).join('') + '</ul>' +
        '<div class="rule-bar" aria-hidden="true"><i></i></div>' +
      '</div>' +
      '<form class="comment-form" novalidate>' +
        '<p class="lock-note" aria-live="polite">' + LOCK + '<span>Check all ' + RULES.length + ' rules above to unlock the comment form.</span></p>' +
        '<fieldset disabled style="margin-top:14px">' +
          '<div><label for="cm-name">Name or handle</label><input id="cm-name" name="name" maxlength="60" autocomplete="nickname" required></div>' +
          '<div><label for="cm-text">Your comment</label><textarea id="cm-text" name="text" maxlength="2000" placeholder="Speak your truth\u2026" required></textarea></div>' +
          '<button class="btn btn-gold" type="submit" disabled>Check all 6 rules to unlock</button>' +
          '<p class="form-note">Comments are reviewed against these guidelines before they appear. Don\u2019t share medical details that could identify you or anyone else.</p>' +
          '<p class="form-status" role="status"></p>' +
        '</fieldset>' +
      '</form>' +
      (comments.length
        ? '<div class="comments"><h3>Comments (' + comments.length + ')</h3>' + comments.map(function(c){
            return '<div class="comment"><b>' + esc(c.name) + '</b><time datetime="' + esc(c.date) + '">' + fmtDate(c.date) + '</time><p>' + esc(c.text) + '</p></div>';
          }).join('') + '</div>'
        : '</details>') +
    '</section>';
  }

  function bindBraveSpace(root, p){
    var boxes = root.querySelectorAll('.rule-cb'); if (!boxes.length) return;
    var rem = root.querySelector('.remaining'), remN = root.querySelector('.rem-n'), bar = root.querySelector('.rule-bar i');
    var form = root.querySelector('.comment-form'), fs = form.querySelector('fieldset'), btn = form.querySelector('button');
    var note = form.querySelector('.lock-note'), status = form.querySelector('.form-status'), timer = null;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function update(){
      var n = 0; boxes.forEach(function(b){ if (b.checked) n++; });
      var left = boxes.length - n;
      bar.style.width = (n / boxes.length * 100) + '%';
      clearInterval(timer);
      if (left > 0){
        rem.classList.remove('done'); rem.innerHTML = LOCK + '<span class="rem-n">' + left + ' remaining</span>';
        fs.disabled = true; btn.disabled = true; btn.textContent = 'Check all ' + boxes.length + ' rules to unlock';
        note.className = 'lock-note'; note.innerHTML = LOCK + '<span>Check all ' + boxes.length + ' rules above to unlock the comment form.</span>';
        return;
      }
      rem.classList.add('done'); rem.innerHTML = UNLOCK + '<span class="rem-n">All rules checked</span>';
      fs.disabled = false; note.className = 'lock-note open'; note.innerHTML = UNLOCK + '<span>Comment form unlocked.</span>';
      var t = 3; btn.disabled = true; btn.textContent = 'Pause\u2026 ' + t;
      timer = setInterval(function(){
        t--; if (t > 0) { btn.textContent = 'Pause\u2026 ' + t; return; }
        clearInterval(timer); btn.disabled = false; btn.textContent = 'Submit comment for review';
      }, 1000);
    }
    boxes.forEach(function(b){ b.addEventListener('change', update); });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.querySelector('#cm-name').value.trim(), text = form.querySelector('#cm-text').value.trim();
      if (!name || !text){ status.textContent = 'Add a name or handle and a comment to submit.'; status.className = 'form-status err'; return; }
      var body = 'Post: ' + p.title + '\nLink: https://theharnessproject.org/blog/' + p.slug + '\nName or handle: ' + name +
        '\nAgreed to all 6 Brave Space ground rules: yes\n\nComment:\n' + text;
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Comment for review: ' + p.title) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Comment ready. Send it from your email app to submit it for review.'; status.className = 'form-status';
      mailFallback(form.querySelector('fieldset'), 'Comment for review: ' + p.title, body, 'comment');
    });
  }


  function fmtDate(iso){
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function sorted(){ return POSTS.slice().sort(function(a,b){ return a.date < b.date ? 1 : -1; }); }
  function draftTag(p){ return p.draft ? '<span class="draft">Draft</span>' : ''; }

  var currentFilter = "all";
  function renderBlogIndex(){
    var list = sorted().filter(function(p){ return currentFilter === "all" || p.audience === currentFilter; });
    var feat = document.getElementById("blog-feature"), ul = document.getElementById("blog-list"), empty = document.getElementById("blog-empty");
    empty.hidden = list.length > 0;
    if (!list.length){ feat.innerHTML = ""; ul.innerHTML = ""; return; }
    var f = list[0];
    feat.innerHTML =
      '<a class="feature" href="/blog/' + f.slug + '">' +
        '<div class="band">' + heroSVG(f, true) + '</div>' +
        '<div class="copy"><span class="aud ' + f.audience + '">' + AUD[f.audience] + '</span>' +
        '<h2 class="h-dark-sm">' + esc(f.title) + draftTag(f) + '</h2>' +
        '<p class="muted">' + esc(f.excerpt) + '</p>' +
        '<span class="post-meta">' + metaLine(f) + '</span></div></a>';
    ul.innerHTML = list.slice(1).map(function(p){
      return '<li class="post-item"><a href="/blog/' + p.slug + '">' +
        '<span class="thumb">' + heroSVG(p, true) + '</span>' +
        '<div><span class="aud ' + p.audience + '">' + AUD[p.audience] + '</span>' +
        '<h3>' + esc(p.title) + draftTag(p) + '</h3><p>' + esc(p.excerpt) + '</p>' +
        '<span class="post-meta" style="display:block;margin-top:10px">' + metaLine(p) + '</span></div></a></li>';
    }).join("");
  }

  function renderHomePosts(){
    var el = document.getElementById("home-posts"); if (!el) return;
    el.innerHTML = sorted().slice(0,3).map(function(p){
      return '<a href="/blog/' + p.slug + '"><span class="thumb">' + heroSVG(p, true) + '</span><span class="aud ' + p.audience + '">' + AUD[p.audience] + '</span>' +
        '<h3>' + esc(p.title) + '</h3><span class="post-meta">' + AUTHOR.name + '<br>' + fmtDate(p.date) + ' — ' + p.minutes + ' min read</span></a>';
    }).join("");
  }


  function articleHTML(p){
    var adult = p.audience === "adult";
    var q = adult ? p.question : p.reflect;
    return '<div class="beat beat-hook"><div class="beat-label"><span>' + (adult ? 'The 1 a.m. Reality' : 'The moment') + '</span><time>' + esc(p.hookTime || '') + '</time></div>' + p.hook + '</div>' +
      '<div class="beat-label beat-pivot"><span>The pivot</span><b>' + esc(p.pivot || '') + '</b></div>' +
      p.body +
      (p.takeaway ? '<div class="takeaway"><span>Key takeaway</span><p>' + esc(p.takeaway) + '</p></div>' : '') +
      '<div class="closing"><h2>Bring it home</h2>' + (p.closing || '') +
        (q ? '<div class="reflect"><span>' + (adult ? 'Today\u2019s question' : (p.audience === 'parent' ? 'Try this at home' : 'Reflect')) + '</span><p>' + esc(q) + '</p>' +
          (adult ? '<a class="btn btn-gold" href="#brave-h">Answer in the comments</a>' : '') +
          (p.reflectNote ? '<p class="reflect-note">' + esc(p.reflectNote) + '</p>' : '') + '</div>' : '') +
      '</div>' +
      '<p class="disclaimer">The HARNESS Project LLC | theharnessproject.org. For educational purposes only. Not medical advice. \u00A9 2026 Christopher Zacharie and The HARNESS Project LLC. All rights reserved.</p>';
  }

  function renderPost(slug){
    var all = sorted(), i = -1;
    for (var k=0;k<all.length;k++){ if (all[k].slug === slug) { i = k; break; } }
    var page = document.getElementById("post-page");
    if (i < 0){
      page.className = "page skin-dark";
      page.innerHTML = '<section class="section"><div class="wrap"><h1 class="h-dark">Post not found</h1><p class="lede">This post may have moved or been renamed.</p><a class="btn btn-gold" href="/blog">Browse all posts</a></div></section>';
      page.setAttribute("data-title", "Post not found — The HARNESS Project");
      return;
    }
    var p = all[i], next = all[i+1] || all[0], light = p.audience === "youth" || p.audience === "parent", parent = p.audience === "parent", edu = p.audience === "educator";
    page.className = "page " + (light ? "skin-light" : (edu ? "skin-dark skin-edu" : "skin-dark"));
    page.setAttribute("data-title", p.title.length > 44 ? p.title : p.title + " — The 1 a.m. Reality");
    var headCls = light ? "h-light" : "h-dark";
    var btnBack = light ? "btn btn-outline-light" : "btn btn-ghost";
    var btnNext = light ? "btn btn-blue" : "btn btn-gold";
    var cta = p.audience === "adult"
      ? '<div class="hud" style="margin-top:40px;max-width:68ch"><h2 class="h-dark-sm">Get The Signal</h2><p class="muted">Practical prevention updates and stress-test drills, in your inbox.</p><a class="btn btn-gold" href="https://the-harness-project-llc.kit.com/3fc0b93855" target="_blank" rel="noopener">Get The Signal</a><p class="sig-more">Adults 18+ · <a href="/signal">What’s in each issue</a></p></div>'
      : (p.audience === "parent"
        ? '<div class="card-light" style="margin-top:40px;max-width:68ch"><h2 class="h-light-sm">See what your student will learn</h2><p>Request the CAPE parent preview: sample lessons and the family conversation guide, before your student starts.</p><a class="btn btn-blue" href="/contact">Request the parent preview</a></div>'
        : p.audience === "youth"
        ? '<div class="card-light" style="margin-top:40px;max-width:68ch"><h2 class="h-light-sm">Bring CAPE to your school</h2><p>Grades 6–12, aligned to Texas TEKS health standards, with a parent preview available.</p><a class="btn btn-blue" href="/partners">Request a pilot</a></div>'
        : '<div class="hud" style="margin-top:40px;max-width:68ch"><h2 class="h-dark-sm">Teach this with fidelity</h2><p class="muted">Certified facilitators get the full activity sets in the Educators Hub.</p><a class="btn btn-gold" href="/certification">Start certification</a></div>');
    page.innerHTML =
      '<section class="post-head"><div class="wrap">' +
        '<a class="' + btnBack + '" href="/blog" style="margin-bottom:22px">Back to The 1 a.m. Reality</a>' +
        '<figure class="post-mast' + (edu ? ' edu' : '') + '"><img src="' + (light ? LANE_ART.MAST_YOUTH : (edu ? LANE_ART.MAST_EDU : LANE_ART.MAST_ADULT)) + '" width="900" height="' + (light ? 434 : (edu ? 503 : 436)) + '" alt="The 1 a.m. Reality' + (light || edu ? '. Moving from Anxiety to Agency.' : '. The HARNESS Blog: Moving from Anxiety to Agency.') + '"></figure>' +
        '<figure class="post-hero">' + heroSVG(p, false) + '</figure>' +
        '<span class="aud ' + p.audience + '">' + AUD[p.audience] + '</span>' + draftTag(p) +
        '<h1 class="' + headCls + '" style="margin-top:12px">' + esc(p.title) + '</h1>' +
        '<div class="byline">' + avatarHTML() + '<span><b>' + AUTHOR.name + '</b><span class="post-meta">' + fmtDate(p.date) + (p.updated ? ' · Updated <time datetime="' + p.updated + '">' + fmtDate(p.updated) + '</time>' : '') + ' — ' + p.minutes + ' min read — The 1 a.m. Reality</span></span></div>' +
      '</div></section>' +
      '<section class="post-body"><div class="wrap"><article class="prose">' + articleHTML(p) + '</article>' +
        '<aside class="author-card" aria-label="About the author">' + avatarHTML() + '<div><p class="post-meta" style="margin-bottom:4px">Written by</p><b style="display:block;font:700 18px/1.3 var(--body)">' + AUTHOR.name + '</b><p style="margin-bottom:8px">' + AUTHOR.role + '</p><p>' + AUTHOR.bio + ' <a href="/about">About</a></p></div></aside>' +
        cta + (p.audience === 'adult' ? braveSpaceHTML(p) : '') +
        '<div class="post-foot"><a class="' + btnBack + '" href="/blog">All posts</a>' +
        (next.slug !== p.slug ? '<a class="' + btnNext + '" href="/blog/' + next.slug + '">Next: ' + esc(next.title) + '</a>' : '') +
        '</div></div></section>';
    bindForms(page);
    bindBraveSpace(page, p);
  }

  document.querySelectorAll("[data-filter]").forEach(function(b){
    b.addEventListener("click", function(){
      currentFilter = b.getAttribute("data-filter");
      document.querySelectorAll(".filters [data-filter]").forEach(function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      renderBlogIndex();
    });
  });
  (document.querySelector("[data-filter-reset]")||document.createElement("i")).addEventListener("click", function(){
    document.querySelector('.filters [data-filter="all"]').click();
  });

  function parse(){
    var h = location.hash.replace(/^#/, ''); if (!h) { h = (location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '') || '/') + location.search; }
    if (h.charAt(0) !== '/') return null; // in-page anchor
    var parts = h.split('?');
    var q = {};
    (parts[1]||'').split('&').forEach(function(kv){ if(kv){ var p=kv.split('='); q[decodeURIComponent(p[0])]=decodeURIComponent(p[1]||''); } });
    return { path: parts[0], query: q };
  }

  function route(){
    var r = parse();
    if (!r) { // anchor inside current page
      var el = document.getElementById(location.hash.slice(1));
      if (el) el.scrollIntoView();
      return;
    }
    var match;
    if (r.path.indexOf('/blog/') === 0) { renderPost(decodeURIComponent(r.path.slice(6))); match = document.getElementById('post-page'); }
    else match = pages.filter(function(p){ return p.getAttribute('data-route') === r.path; })[0] || pages[0];
    if (r.path === '/blog') { if (r.query.lane && AUD[r.query.lane]) { currentFilter = r.query.lane; document.querySelectorAll('.filters [data-filter]').forEach(function(x){ x.setAttribute('aria-pressed', x.getAttribute('data-filter') === currentFilter ? 'true' : 'false'); }); } renderBlogIndex(); }
    pages.forEach(function(p){ p.hidden = (p !== match); }); var mh = document.querySelector('.masthead'); if (mh) mh.hidden = (match.getAttribute('data-route') !== '/');
    document.title = match.getAttribute('data-title');
    var md = match.getAttribute('data-desc');
    if (md) [['name','description'],['property','og:description'],['name','twitter:description']].forEach(function(k){ var m = document.querySelector('meta['+k[0]+'="'+k[1]+'"]'); if (m) m.setAttribute('content', md); });
    [['property','og:title'],['name','twitter:title']].forEach(function(k){ var m = document.querySelector('meta['+k[0]+'="'+k[1]+'"]'); if (m) m.setAttribute('content', document.title); });
    navLinks.forEach(function(a){
      var ar = match.getAttribute('data-route'); if (ar === '/blog/post') ar = '/blog';
      if ((a.getAttribute('href') === ar || a.getAttribute('href') === ar + '/')) a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
    if (r.query.topic) { var t = document.getElementById('c-topic'); if (t) t.value = r.query.topic; }
    nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); closeGroups(); groups.forEach(function(g){ g.classList.toggle('on', !!g.querySelector('a[aria-current]')); });
    window.scrollTo(0,0);
    if (r.query.to) { var tgt = document.getElementById(r.query.to); if (tgt) setTimeout(function(){ tgt.scrollIntoView(); }, 30); }
    var h1 = match.querySelector('h1'); if (h1) { h1.setAttribute('tabindex','-1'); h1.focus({preventScroll:true}); }
    drawStars();
  }

  // in-page anchor links (e.g. #cape-parents) shouldn't break routing
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href.charAt(1) !== '/') {
      var el = document.getElementById(href.slice(1));
      if (el) { e.preventDefault(); el.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); }
    }
  });

  var groups = Array.prototype.slice.call(document.querySelectorAll('.nav .ng'));
  function closeGroups(except){ groups.forEach(function(g){ if (g === except) return; g.querySelector('.ng-panel').classList.remove('open'); g.querySelector('.ng-btn').setAttribute('aria-expanded','false'); }); }
  function closeMore(){ closeGroups(); }
  var moreBtn = null;
  groups.forEach(function(g){
    var b = g.querySelector('.ng-btn'), pnl = g.querySelector('.ng-panel');
    b.addEventListener('click', function(e){ e.stopPropagation(); var o = !pnl.classList.contains('open'); closeGroups(g); pnl.classList.toggle('open', o); b.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  });
  document.addEventListener('click', function(e){ if (!e.target.closest('.nav .ng') && window.innerWidth >= 960) closeGroups(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { closeGroups(); nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); } });
  menuBtn.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Starfield — drawn once per size, no animation
  function drawStars(){
    document.querySelectorAll('canvas.stars').forEach(function(cv){
      var r = cv.getBoundingClientRect();
      if (!r.width) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      var ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
      var seed = 7; function rnd(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      var n = Math.round(r.width * r.height / 2600);
      for (var i=0;i<n;i++){
        var x = rnd()*r.width, y = rnd()*r.height*0.8, s = rnd();
        ctx.fillStyle = s > .96 ? '#3ED6E8' : (s > .92 ? '#FFC93C' : '#C9D2E3');
        ctx.globalAlpha = .35 + rnd()*.65;
        ctx.fillRect(x, y, s > .9 ? 2 : 1, s > .9 ? 2 : 1);
      }
      ctx.globalAlpha = 1;
    });
  }
  var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(drawStars, 150); });

  // Forms compose an email in the visitor's mail app. Because that depends on the
  // visitor having a mail app set up, every send also shows a copy-and-send fallback.
  function copyText(text, btn){
    var done = function(){ var t = btn.textContent; btn.textContent = 'Copied'; setTimeout(function(){ btn.textContent = t; }, 1600); };
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(done, function(){ legacy(); }); return; }
    legacy();
    function legacy(){ var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} ta.remove(); }
  }
  function mailFallback(form, subject, body, what){
    var box = form.querySelector('.mail-fallback');
    if (!box) { box = document.createElement('div'); box.className = 'mail-fallback'; form.appendChild(box); }
    var full = 'To: ' + EMAIL + '\nSubject: ' + subject + '\n\n' + body, id = 'mf-' + Math.random().toString(36).slice(2, 8);
    box.innerHTML =
      '<p><b>Your email app should open with your ' + what + ' ready to send.</b> If nothing opened, or this device has no email app, copy it below and send it to <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> from any email account, including webmail.</p>' +
      '<label for="' + id + '">Your ' + what + '</label><textarea id="' + id + '" readonly rows="6"></textarea>' +
      '<div class="btn-row"><button type="button" class="btn btn-ghost" data-copy="msg">Copy ' + what + '</button><button type="button" class="btn btn-ghost" data-copy="addr">Copy email address</button></div>' +
      '<p class="form-note">We reply within one business day.</p>';
    box.querySelector('textarea').value = full;
    box.querySelector('[data-copy="msg"]').addEventListener('click', function(){ copyText(full, this); });
    box.querySelector('[data-copy="addr"]').addEventListener('click', function(){ copyText(EMAIL, this); });
  }
  function bindForms(root){ root.querySelectorAll('form[data-mail]').forEach(function(f){
    if (f.dataset.bound) return; f.dataset.bound = '1';
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var status = f.querySelector('.form-status') || f.parentNode.querySelector('.form-status');
      if (!f.checkValidity()) {
        f.reportValidity();
        if (status){ status.textContent = 'Fill in the required fields to continue.'; status.className = 'form-status err'; }
        return;
      }
      var d = new FormData(f), kind = f.getAttribute('data-mail'), subject, lines = [];
      if (kind === 'signal') {
        if (SIGNAL_ENDPOINT) {
          var pf = document.createElement('form'); pf.method = 'POST'; pf.action = SIGNAL_ENDPOINT; pf.target = '_blank'; pf.style.display = 'none';
          [[SIGNAL_EMAIL_FIELD, d.get('email')], [SIGNAL_NAME_FIELD, d.get('name') || '']].forEach(function(p){ if (!p[0] || !p[1]) return; var i = document.createElement('input'); i.type = 'hidden'; i.name = p[0]; i.value = p[1]; pf.appendChild(i); });
          document.body.appendChild(pf); pf.submit(); pf.remove(); f.reset();
          if (status){ status.textContent = 'Check your inbox to confirm your subscription to The Signal.'; status.className = 'form-status'; }
          return;
        }
        subject = 'Subscribe me to The Signal';
        lines.push('Please add me to The Signal.', '', 'Email: ' + d.get('email'));
        if (d.get('name')) lines.push('First name: ' + d.get('name'));
        var tp = d.getAll('topics'); if (tp.length) lines.push('Interested in: ' + tp.join(', '));
        if (d.get('adult')) lines.push('I confirm I am 18 or older.');
        lines.push('Signed up from: ' + (location.hash.replace('#', '') || '/'));
      }
      else if (kind === 'pilot') { subject = 'Pilot request: ' + d.get('organization');
        ['name','email','organization','type','track','participants','start','message'].forEach(function(k){ lines.push(k.charAt(0).toUpperCase()+k.slice(1) + ': ' + (d.get(k)||'')); }); }
      else { subject = 'Website inquiry: ' + f.querySelector('#c-topic').selectedOptions[0].text;
        ['name','email','message'].forEach(function(k){ lines.push(k.charAt(0).toUpperCase()+k.slice(1) + ': ' + (d.get(k)||'')); }); }
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      if (status){ status.textContent = 'Message ready. Send it from your email app to finish.'; status.className = 'form-status'; }
      if (kind !== 'signal') mailFallback(f, subject, lines.join('\n'), kind === 'pilot' ? 'pilot request' : 'message');
    });
  }); }
  bindForms(document);
  document.addEventListener('click', function(e){ var j = e.target.closest && e.target.closest('[data-jump]'); if (!j) return; var t = document.getElementById(j.getAttribute('data-jump')); if (t){ e.preventDefault(); t.scrollIntoView({behavior: 'smooth', block: 'start'}); var inp = t.querySelector('input[type=email]'); if (inp) setTimeout(function(){ inp.focus({preventScroll: true}); }, 400); } });
  renderHomePosts();

  window.addEventListener('hashchange', route);
  route();
})();
