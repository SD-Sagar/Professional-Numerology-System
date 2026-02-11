// Pythagorean alphabet map (A=1... Z=9) with standard professional mapping
      const LETTER_MAP = {
        A: 1,
        J: 1,
        S: 1,
        B: 2,
        K: 2,
        T: 2,
        C: 3,
        L: 3,
        U: 3,
        D: 4,
        M: 4,
        V: 4,
        E: 5,
        N: 5,
        W: 5,
        F: 6,
        O: 6,
        X: 6,
        G: 7,
        P: 7,
        Y: 7,
        H: 8,
        Q: 8,
        Z: 8,
        I: 9,
        R: 9,
      };

      const VOWELS = new Set(["A", "E", "I", "O", "U"]); // Y treated as consonant by design
      const MASTER_NUMBERS = new Set([11, 22, 33]);

      function reduceNumber(value) {
        // Normalize to integer sum of digits (ignoring non-digits)
        let cleaned = String(value).replace(/\\D/g, "");
        if (!cleaned) return 0;
        let num = parseInt(cleaned, 10);

        // Iteratively reduce, preserving master numbers 11, 22, 33
        while (num > 9 && !MASTER_NUMBERS.has(num)) {
          num = String(num)
            .split("")
            .reduce((sum, d) => sum + Number(d), 0);
        }

        // Guard: numerologically, 0 is not a valid endpoint
        return num === 0 ? 1 : num;
      }

      function lettersToNumber(name, filterFn) {
        const chars = name
          .toUpperCase()
          .normalize("NFD")
          .replace(/[^A-Z\\s]/g, "")
          .split("");

        const filtered = filterFn ? chars.filter(filterFn) : chars.filter((c) => /[A-Z]/.test(c));

        const sum = filtered.reduce((acc, ch) => acc + (LETTER_MAP[ch] || 0), 0);
        return reduceNumber(sum);
      }

      function calculateLifePath(dateStr) {
        if (!dateStr) return 0;
        // Expecting ISO-like string: YYYY-MM-DD
        const parts = dateStr.split("-");
        if (parts.length !== 3) return 0;
        const [yearStr, monthStr, dayStr] = parts;

        const monthReduced = reduceNumber(monthStr);
        const dayReduced = reduceNumber(dayStr);
        const yearReduced = reduceNumber(yearStr);

        const total = monthReduced + dayReduced + yearReduced;
        return reduceNumber(total);
      }

      function calculateBirthday(dateStr) {
        if (!dateStr) return 0;
        const d = new Date(dateStr + "T00:00:00");
        if (Number.isNaN(d.getTime())) return 0;
        return d.getDate();
      }

      function calculatePersonalYear(dateStr) {
        if (!dateStr) return 0;
        const parts = dateStr.split("-");
        if (parts.length !== 3) return 0;
        const [, monthStr, dayStr] = parts;
        const today = new Date();
        const currentYear = today.getFullYear();
        const m = reduceNumber(monthStr);
        const d = reduceNumber(dayStr);
        const y = reduceNumber(String(currentYear));
        return reduceNumber(m + d + y);
      }

      function calculatePersonalMonth(dateStr) {
        const py = calculatePersonalYear(dateStr);
        if (!py) return 0;
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const cm = reduceNumber(String(currentMonth));
        return reduceNumber(py + cm);
      }

      function calculatePersonalDay(dateStr) {
        const pm = calculatePersonalMonth(dateStr);
        if (!pm) return 0;
        const today = new Date();
        const currentDay = today.getDate();
        const cd = reduceNumber(String(currentDay));
        return reduceNumber(pm + cd);
      }

      // Descriptions database
      const descriptions = {
        lifePath: {
          1: "As a Life Path 1, you are fundamentally driven by leadership, independence, and a strong pioneering spirit. You are most fulfilled when you are carving your own trail rather than following someone else’s script, setting standards instead of merely meeting them. Periods of self-doubt or hesitation are simply invitations to step more fully into your natural authority and courage. The more you trust your inner compass and take decisive action, the more life responds by opening doors that match your originality and bold vision.",
          2: "With a Life Path 2, your essence is cooperation, harmony, and refined sensitivity. You are naturally attuned to the needs, emotions, and subtleties of others, often sensing what is unspoken before anyone else. This path asks you to balance your desire to keep the peace with the need to honor your own truth. When you cultivate healthy boundaries, your gifts as a mediator, partner, and intuitive guide become exceptionally powerful.",
          3: "Life Path 3 emphasizes creativity, communication, and joyful self‑expression. You thrive when your voice, ideas, or artistry are given space to be seen and heard, whether through words, visuals, or performance. At times, scattered focus or self‑criticism can block your natural brilliance, causing you to hide your true colors. Your journey is to trust your originality and share it consistently, knowing that your light uplifts others simply by being honest and expressive.",
          4: "With a Life Path 4, you are the architect, builder, and stabilizer of the numerological spectrum. You are at your best when you can create structure, systems, and reliable foundations that stand the test of time. Life may present you with lessons around patience, discipline, and the long game rather than quick shortcuts. As you embrace methodical progress, you become a grounded force others can depend on for realism, integrity, and follow‑through.",
          5: "Life Path 5 centers on freedom, adaptability, and experiential learning. You are designed to explore, evolve, and keep life moving, whether through travel, changing environments, or constantly upgrading your mindset. Restlessness or overindulgence can occasionally scatter your energy, but these are simply signs that your soul craves more meaningful change. When you align your appetite for variety with a deeper purpose, you become a powerful agent of transformation for yourself and others.",
          6: "A Life Path 6 is devoted to responsibility, care, and the art of creating harmony in your immediate world. You are drawn toward nurturing roles, whether in family, community, or professional spaces where you can support others. The challenge is to avoid over‑sacrifice or perfectionism, which can leave you feeling unappreciated or overextended. As you learn to balance service with self‑care, your ability to heal, beautify, and bring stability becomes truly magnetic.",
          7: "Life Path 7 carries a vibration of introspection, analysis, and spiritual depth. You are naturally reflective and often seek truth beneath the surface of appearances, valuing wisdom over shallow answers. At times you may feel misunderstood or distant, yet this solitude is often where your most profound insights arise. As you blend intellect with intuition and remain open to life’s mysteries, you become a quiet but powerful source of clarity and higher perspective.",
          8: "With an 8 Life Path, you are learning mastery over power, material success, and personal influence. You are drawn to big visions, leadership roles, or arenas where results and accountability truly matter. Money and authority can be both teachers and mirrors for you, revealing where your confidence and ethics are strongest—or still evolving. When you align ambition with integrity and service, you become a highly effective steward of resources and a force for tangible impact.",
          9: "Life Path 9 is the path of compassion, completion, and global awareness. You often feel called to contribute to something larger than yourself, whether through creativity, humanitarian work, or emotional support. Letting go—of people, roles, or past identities—can be a recurring theme, yet each release expands your capacity for unconditional love. As you integrate your experiences, you embody wisdom, empathy, and a soulful understanding that can inspire many.",
          11: "As a Master Number 11 Life Path, you carry an amplified vibration of intuition, inspiration, and spiritual illumination. Your presence often activates deeper awareness in others, even when you are not consciously trying to lead. This path can feel intense, alternating between deep sensitivity and powerful bursts of clarity or creativity. When you ground your nervous system and honor both your human needs and spiritual insights, you become a luminous bridge between higher vision and everyday life.",
          22: "Life Path 22 is known as the Master Builder, blending visionary sensitivity with the ability to manifest on a large scale. You are capable of turning inspired concepts into highly practical structures, organizations, or systems that endure. At times you may feel the weight of high expectations, either from yourself or others, which can create pressure or self‑doubt. As you learn to pace yourself and trust your long‑range vision, you become a powerful architect of change in the material world.",
          33: "As a Master Number 33 Life Path, your core theme revolves around elevated compassion, service, and heart‑centered leadership. You may find yourself in roles where others look to you for healing, reassurance, or soulful guidance, even informally. The emotional intensity of this path can be demanding, asking you to integrate your own wounds while still showing up with kindness. When you cultivate strong energetic boundaries and self‑acceptance, your ability to embody unconditional love becomes profoundly transformative.",
        },
        expression: {
          1: "An Expression 1 indicates a natural talent for leadership, independence, and original thinking. You tend to excel when allowed to pioneer new ideas, set your own pace, or operate with a degree of autonomy. Authority figures and rigid systems may challenge you, but they also refine your ability to stand tall in your convictions. As you harness your willpower with maturity and clarity, you become a bold initiator who opens new pathways for others.",
          2: "With an Expression 2, you are gifted in diplomacy, listening, and subtle influence. Rather than forcing outcomes, you instinctively sense how to guide situations toward balance through cooperation and tact. You often shine behind the scenes, supporting partnerships, teams, or one‑to‑one dynamics where sensitivity is essential. As you trust the power of gentleness and emotional intelligence, you become an indispensable bridge‑builder in both personal and professional spaces.",
          3: "Expression 3 bestows expressive flair, creativity, and a gift with language or artistic forms. You may be naturally witty, visually imaginative, or emotionally articulate in ways that others find engaging and uplifting. However, your vibrancy is at its strongest when you channel it into consistent practice rather than sporadic bursts. As you commit to refining your craft and sharing your truth, you become a magnetic communicator whose presence brightens the environments you enter.",
          4: "An Expression 4 points to a grounded, reliable, and system‑oriented way of operating. You are often at your best when organizing processes, managing details, or building frameworks that others can depend on. Quick shortcuts and unstable ventures tend not to appeal to you, as you intuitively understand the value of structure and persistence. Over time, your steady approach earns you trust and authority as someone who can be counted on to bring order out of chaos.",
          5: "With an Expression 5, you embody versatility, curiosity, and a flair for navigating change. You tend to learn best through direct experience and may shift paths or roles more than most as you search for authentic freedom. When unsupported, this can look like restlessness, but at its higher octave it becomes a refined ability to adapt and innovate. As you direct your appetite for variety toward meaningful exploration, you become a skilled guide through transition and transformation.",
          6: "Expression 6 gives you a natural inclination toward caretaking, refinement, and responsibility. You often notice what needs improvement—whether in relationships, aesthetics, or systems—and feel compelled to elevate it. When unbalanced, this can slip into over‑worry or trying to fix others, yet at your best you create environments of warmth and beauty. As you balance service with self‑respect, your presence becomes deeply reassuring and your influence quietly harmonizing.",
          7: "An Expression 7 highlights your gifts in analysis, research, and inner reflection. You may be drawn to fields where depth, precision, or spiritual inquiry are central, preferring truth over surface appearances. Socially, you might seem reserved at first, but those who gain your trust often discover a rich inner world and sharp perception. As you integrate both intellect and intuition, you become a discerning thinker whose insights bring clarity to complex situations.",
          8: "Expression 8 confers strong executive ability, strategic thinking, and a comfort with responsibility and scale. You are often drawn to roles where you can manage resources, lead teams, or oversee significant projects with tangible outcomes. Lessons around fair use of power, money, and influence may arise repeatedly, pushing you toward higher integrity. When you align ambition with service and ethics, you become a formidable force for constructive achievement.",
          9: "With an Expression 9, you carry an artistic, humanitarian, or big‑picture orientation to life. You may feel compelled to express universal themes—such as justice, compassion, or healing—through your work or relationships. A tendency to feel deeply can sometimes leave you longing or nostalgic, yet these emotions also enrich your empathy. As you accept the full range of your experiences, you become a wise and emotionally resonant presence who inspires others toward greater understanding.",
          11: "As an Expression 11, you have an innate capacity to inspire, awaken, and transmit higher ideas through your words or presence. You may be drawn to visionary roles—teaching, mentoring, creative arts, or spiritual work—where subtle energy is as important as visible results. Periods of nervousness or heightened sensitivity are not flaws but signals that your system is processing more than average. When you cultivate grounding practices and honor your intuitive flashes, you become a luminous communicator of hope and possibility.",
          22: "Expression 22 represents the potential to bring expansive yet practical creations into the world. You may find yourself naturally skilled at planning, logistics, or systems design, especially when the goal serves a wider community or long‑term vision. This vibration can feel demanding, occasionally confronting you with large responsibilities or complex projects. As you learn to trust your capacity step by step, you become a builder of structures—physical or organizational—that leave a lasting legacy.",
          33: "With an Expression 33, you are wired to radiate compassionate leadership and heartfelt service through your talents. Others may sense you as a calming, encouraging, or healing presence, even in ordinary interactions. Because your sensitivity runs high, you are asked to cultivate strong inner stability and self‑care so you do not burn out. When you honor your own needs while still sharing your gifts, your creative and emotional guidance can become profoundly uplifting for those around you.",
        },
        soul: {
          1: "A Soul Urge 1 reveals a deep inner desire for autonomy, impact, and self‑definition. At your core, you long to feel that your choices are your own and that your life reflects your unique imprint. Situations that restrict your initiative or minimize your voice can feel especially draining to you. As you courageously follow your authentic impulses, you experience a profound sense of fulfillment and inner strength.",
          2: "With a Soul Urge 2, your heart longs for harmony, closeness, and genuine partnership. You are nourished by emotional safety, mutual understanding, and the feeling of being truly seen by those you trust. Harsh environments or competitive dynamics can weigh on you more than on others, because you naturally seek gentleness and cooperation. When you allow your sensitivity to guide you toward aligned relationships, your inner world blossoms with peace and connection.",
          3: "A Soul Urge 3 indicates a deep craving for creative expression, playfulness, and emotional openness. Your heart comes alive when you can share your ideas, humor, or artistry without self‑censorship. When you suppress your feelings or dim your flair to stay safe, life can feel unusually flat or constricted. As you give yourself permission to express your truth with warmth and authenticity, you tap into a wellspring of joy that nourishes both you and those around you.",
          4: "With a Soul Urge 4, you yearn for stability, reliability, and clear structure in both your inner and outer world. Chaos, unpredictability, or vague commitments tend to unsettle you more than most. Deep down, you feel safest when you know what can be counted on and where your energy is best invested. As you consciously build routines, systems, and relationships that respect your need for order, your inner sense of security grows strong and steady.",
          5: "A Soul Urge 5 points to a powerful inner longing for freedom, variety, and adventure. Your heart resists feeling boxed in, whether by routines, beliefs, or environments that lack movement and growth. You are revitalized by experiences that expand your horizons—through learning, travel, or new perspectives. When you choose change consciously rather than impulsively, you discover that your quest for freedom can coexist beautifully with responsibility and depth.",
          6: "With a Soul Urge 6, you deeply desire to love and be loved in a way that feels loyal, safe, and mutually supportive. You are often drawn to caring for others, creating beauty in your surroundings, or taking on roles that protect those you cherish. At times you may give too much or hold yourself to impossible standards, which can quietly exhaust your heart. As you practice receiving as generously as you give, you discover that balanced nurturing is your greatest source of inner fulfillment.",
          7: "A Soul Urge 7 reveals a profound need for meaning, solitude, and inner truth. Your heart is not satisfied with superficial answers; it yearns to understand the deeper patterns behind life and your own experiences. You may be energized by study, contemplation, or spiritual exploration, and drained by constant noise or drama. When you honor your need for quiet reflection and trust your inner knowing, your sense of inner peace and spiritual connection grows significantly.",
          8: "With a Soul Urge 8, you long for a sense of empowerment, achievement, and recognized competence. Deep within, you want to feel that your efforts translate into tangible results and that you can direct your own destiny. Environments that keep you small, dependent, or undervalued can feel especially uncomfortable for you. As you step into responsible power and set clear goals, you experience profound satisfaction in building a life that reflects your strength and determination.",
          9: "A Soul Urge 9 indicates a deep inner call toward compassion, service, and emotional richness. Your heart is moved by the suffering or beauty of the world, and you may feel a strong desire to alleviate pain or create something meaningful. Holding onto past hurts or disappointments can weigh heavily on you, yet you are uniquely capable of transforming them into wisdom. As you practice forgiveness and channel your feelings into creative or humanitarian outlets, your inner life becomes a powerful source of grace.",
          11: "With a Soul Urge 11, you yearn for spiritual connection, inspiration, and a life that feels guided by higher purpose. Ordinary routines may never fully satisfy you unless they are infused with meaning or a sense of alignment. Your heart is sensitive to energy, environments, and unspoken dynamics, which can be both a gift and a challenge. When you cultivate grounding habits and trust your intuitive nudges, you feel most complete living as a conduit for insight, hope, and subtle healing.",
          22: "A Soul Urge 22 reveals a deep desire to contribute something enduring and constructive to the world. Your inner satisfaction grows when you can translate ideals into concrete plans, structures, or communities that uplift many people. Feeling blocked or underutilized can be particularly frustrating, as your spirit senses a larger potential than your current circumstances may show. As you patiently refine your vision and take consistent steps, you experience profound fulfillment in seeing big ideas become reality.",
          33: "With a Soul Urge 33, your heart longs to embody unconditional love, healing, and inspired service. You may feel deeply attuned to the emotional needs of others and called to support, teach, or comfort in meaningful ways. At times, this sensitivity can feel overwhelming, especially if you neglect your own boundaries or needs. When you learn to care for yourself as tenderly as you care for others, your inner world becomes a radiant well of compassion that naturally overflows to those around you.",
        },
        personality: {
          1: "A Personality 1 means others often perceive you as confident, direct, and self‑reliant. Even when you feel uncertain inside, your manner can project decisiveness or authority. People may naturally look to you for leadership or expect you to take initiative in unfamiliar situations. As you consciously balance firmness with openness, your presence becomes both impactful and approachable.",
          2: "With a Personality 2, you tend to come across as gentle, considerate, and quietly observant. Others may experience you as easy to talk to, receptive, or naturally diplomatic, even in tense moments. Because you notice subtleties, you often pick up on moods and dynamics before anyone names them. When you honor your need for emotional space while staying engaged, you become a calming, harmonizing influence.",
          3: "Personality 3 gives you an aura of liveliness, charm, or expressive flair. People might experience you as upbeat, creative, or talkative, even if you are internally more complex or private. Your humor, storytelling ability, or sense of style can make you memorable in social settings. As you use your expressive gifts with sincerity rather than performance alone, your presence becomes both entertaining and genuinely uplifting.",
          4: "With a Personality 4, you are often seen as steady, practical, and grounded. Others may assume that you are reliable, detail‑oriented, or serious about your commitments, and they tend to trust you with responsibilities. While you may not seek the spotlight, your consistency makes you a quiet pillar in many environments. When you allow small moments of spontaneity alongside your structured nature, your presence feels both solid and approachable.",
          5: "A Personality 5 often appears dynamic, adaptable, and curious to others. People may see you as someone who welcomes change, enjoys variety, or brings a sense of movement into any situation. Your willingness to explore new ideas or experiences can be refreshing, though some may find you unpredictable if they crave routine. As you pair your adventurous energy with reliability, you become an exciting yet trustworthy influence.",
          6: "With a Personality 6, you are frequently perceived as caring, responsible, and approachable. Others may feel comfortable confiding in you or relying on you for support, advice, or a sense of home. You often project warmth and an eye for aesthetics, creating environments that feel welcoming and harmonious. When you balance your natural caretaking with clear boundaries, your presence becomes deeply reassuring without becoming overburdened.",
          7: "A Personality 7 can come across as thoughtful, private, or slightly enigmatic. People may sense that you are always observing, analyzing, or contemplating something beneath the surface. This can make you intriguing, though sometimes distant, especially if you withdraw to recharge. As you share your insights with humility and openness, others begin to value you as a wise and perceptive ally.",
          8: "With a Personality 8, others often experience you as strong, capable, and goal‑oriented. You may project a natural authority or seriousness about achievement, even when you are relaxed. Some people might find you intimidating at first, yet they also respect your determination and clarity. When you combine your drive with warmth and fairness, your public image becomes that of a powerful yet trustworthy leader.",
          9: "A Personality 9 tends to radiate empathy, depth, or a quietly soulful presence. People may quickly sense that you understand complex emotions or broader social issues, even without many words. You might be seen as wise beyond your years or as someone who has lived many lives in one. As you allow both your compassion and discernment to guide interactions, others often experience you as deeply humane and inspiring.",
          11: "With a Personality 11, you may appear luminous, sensitive, or unusually inspiring to those around you. Even small comments or gestures from you can have a surprisingly strong impact, as others pick up on the sincerity and intensity behind your presence. Some may project idealized expectations onto you, sensing your potential without seeing your vulnerabilities. When you remain transparent and grounded while honoring your intuitive nature, you become a powerful yet relatable source of encouragement.",
          22: "A Personality 22 can present as composed, capable, and strategically minded. Others may perceive you as someone who thinks in terms of systems, long‑term plans, or collective outcomes rather than just personal gain. This can cause people to entrust you with significant responsibilities or complex tasks. As you integrate humility with your considerable abilities, your presence feels both authoritative and genuinely devoted to the greater good.",
          33: "With a Personality 33, you are often experienced as compassionate, nurturing, and quietly inspirational. People may feel safe opening up to you or may seek your reassurance without fully knowing why. Your kindness and patience can leave a lasting impression, especially when others are going through difficulty. When you express your empathy with healthy boundaries, your presence becomes both healing and sustainably strong.",
        },
        birthday: {
          1: "Born on the 1st, you carry an innate spark of originality and self‑direction. You are often most energized when you can take initiative or pursue projects your own way. Early life may challenge you to develop confidence and a resilient sense of identity. As you learn to trust your instincts, you naturally model courageous individuality for others.",
          2: "A birthday on the 2nd gives you a refined emotional sensitivity and a gift for cooperation. You tend to notice subtleties in tone, body language, and atmosphere, which helps you navigate relationships with care. However, you may need to guard against absorbing other people’s moods as your own. When you honor both your empathy and your need for balance, you become an exceptional partner, friend, or collaborator.",
          3: "Being born on the 3rd infuses you with playful creativity, communication skills, and a love of expression. You are often quick with words, humor, or imaginative ideas that enliven your surroundings. Yet you may sometimes downplay your deeper feelings behind entertainment or charm. As you blend authenticity with your natural sparkle, you become an inspiring voice for joy and honest expression.",
          4: "A 4th‑day birth anchors you with practicality, persistence, and a respect for structure. You are likely to prefer well‑defined plans, clear expectations, and tangible progress over vague promises. At times you may feel impatient with disorder or last‑minute changes, yet these moments also refine your adaptability. When you balance discipline with flexibility, you become a reliable builder of lasting results.",
          5: "Those born on the 5th often possess a lively curiosity and a strong desire for freedom. You may be naturally drawn to new experiences, people, and ideas, making you adaptable and engaging. However, boredom can tempt you into distraction if deeper meaning is missing. As you anchor your love of variety in purposeful directions, your life becomes an exciting and growth‑filled adventure.",
          6: "A 6th‑day birthday emphasizes themes of responsibility, care, and aesthetic sensitivity. You may feel a strong pull toward supporting loved ones, improving your environment, or maintaining harmony in your circles. The challenge is to avoid over‑sacrifice or taking on problems that are not yours to fix. When you balance compassion with self‑respect, you become a steady source of comfort and refinement.",
          7: "Born on the 7th, you carry a contemplative, analytical, and spiritually inclined vibration. You are often drawn toward learning, research, or inner exploration, even if your outer life appears busy. Surface‑level interactions can leave you unsatisfied, as you naturally seek depth and authenticity. As you trust your introspective nature and share your insights selectively, others come to value your quiet wisdom.",
          8: "An 8th‑day birth grants you a natural feel for management, ambition, and material manifestation. You may gravitate toward roles involving leadership, finance, or high‑stakes decision‑making, even informally. Power dynamics, success, and responsibility are recurring themes in your life lessons. When you align your drive with integrity and a sense of service, you become a strong and fair force for progress.",
          9: "Those born on the 9th embody a compassionate, idealistic, and emotionally rich energy. You may feel deeply about justice, art, or human experiences, often sensing more than you can easily explain. There can be a tendency to hold onto past hurts, yet you are equally capable of profound forgiveness. As you channel your feelings into creative or humanitarian outlets, you become a beacon of empathy and understanding.",
          10: "A birthday on the 10th combines the pioneering 1 with the cyclical, expansive 0, amplifying themes of leadership and new beginnings. You are often placed in situations where you must start fresh, innovate, or take charge of your direction. This can feel daunting at times, but it also awakens your courage and resilience. As you recognize your capacity to repeatedly reinvent yourself, you become a powerful example of self‑directed evolution.",
          11: "Born on the 11th, you carry a naturally intuitive, idealistic, and inspirational vibration. You may sense subtle energies, future trends, or emotional undercurrents long before others do. This heightened sensitivity can feel intense, yet it is also the source of your visionary perspective. When you learn to ground your impressions and communicate them clearly, you become a guiding light for those seeking higher understanding.",
          12: "A 12th‑day birthday blends creativity, cooperation, and growth through experience. You may oscillate between wanting to express yourself boldly and wanting to keep the peace with those around you. Life often teaches you through relationships and communication, encouraging you to find your authentic voice. As you embrace both your artistic and diplomatic sides, you become a connector who uplifts others through encouragement and insight.",
          13: "Being born on the 13th brings a practical, transformative, and hard‑working tone to your life. You are often called to build or rebuild structures—whether in career, habits, or relationships—through steady effort. Change may come through circumstances that require resilience and disciplined adaptation. When you accept the long game and refine your methods, you become a master of turning challenges into solid foundations.",
          14: "A 14th‑day birth highlights lessons around freedom, responsibility, and dynamic change. You may experience frequent shifts in environment, work, or relationships, each teaching you about balance and wise choice‑making. Your versatility is a strength, but it flourishes most when anchored in clear values. As you learn to navigate change without losing your center, you become an agile and insightful guide through complex situations.",
          15: "Born on the 15th, you carry a warm, magnetic, and service‑oriented vibration. You may feel naturally drawn to caring roles, creative pursuits, or environments where you can uplift others directly. Love, family, or close bonds play an especially important part in your growth story. When you honor both your nurturing nature and your need for self‑expression, your life becomes a blend of heartfelt responsibility and joyful creativity.",
          16: "A 16th‑day birthday often signifies deep inner learning, spiritual wake‑ups, and intellectual exploration. You may go through pivotal turning points that reshape your beliefs or priorities in profound ways. At times, life may ask you to let go of outer security to gain inner wisdom. As you trust the growth hidden within these shifts, you emerge with a clearer sense of purpose and a mature, insightful presence.",
          17: "Being born on the 17th weaves together ambition, intuition, and long‑range vision. You may feel driven to achieve solid results while also sensing subtle guidance about timing and direction. Tests around authority, responsibility, and ethical use of power can appear throughout your life. When you lead with integrity and stay receptive to inner guidance, you become a builder of success that benefits more than just yourself.",
          18: "A birthday on the 18th carries themes of humanitarian concern, emotional intensity, and leadership through service. You may feel a strong pull to help or improve conditions for others, sometimes taking on more than your share. Balancing personal needs with collective responsibilities becomes a key part of your evolution. As you learn to serve without self‑erasure, your influence can extend compassionately and powerfully into the world.",
          19: "Born on the 19th, you embody a blend of independence, resilience, and renewal. You may frequently find yourself starting over after completing significant life chapters, each time discovering new strengths. This cycle can teach you self‑trust and the ability to stand tall even when external support shifts. When you embrace both your individuality and your capacity to rise again, you become a living example of courageous self‑reliance.",
          20: "A 20th‑day birth emphasizes cooperation, sensitivity, and growth through relationships and group dynamics. You may be especially attuned to fairness, inclusion, and the emotional climate of any setting. While you can sometimes doubt your own decisions, your insight into how choices affect others is a real strength. As you develop inner confidence alongside your empathy, you become a quietly powerful influence for harmony.",
          21: "Being born on the 21st blends creative expression, social warmth, and an optimistic orientation. You are often energized by people, ideas, and experiences that allow you to learn and share simultaneously. At times, scattering your attention too widely can dilute your gifts, but focus can transform this. When you choose a few meaningful avenues for your talents, you become an inspiring connector and communicator.",
          22: "A birthday on the 22nd carries the Master Builder vibration into a very personal form. You may sense from early on that you are meant to accomplish something substantial, even if the specifics are unclear. Responsibility, practicality, and vision are recurring themes in your development. As you patiently cultivate skills and trust your capacity, you can create structures—tangible or symbolic—that have lasting influence.",
          23: "Born on the 23rd, you possess quick thinking, adaptability, and strong communication potential. You may enjoy connecting ideas, people, or opportunities in ways that create movement and fresh possibilities. Restlessness can arise if you feel confined, but it is also a signal that your mind craves new stimulation. When you pair your mental agility with clear priorities, you become an effective and engaging problem‑solver.",
          24: "A 24th‑day birth emphasizes service, family, and the creation of emotional and material security. You may feel drawn to support systems—whether at home, work, or in the community—that keep others grounded and safe. Occasionally, you might underestimate your own needs while taking care of everyone else. As you learn to value your contributions and set healthy boundaries, your nurturing influence becomes both sustainable and deeply impactful.",
          25: "Being born on the 25th weaves together intellectual curiosity, intuition, and a desire for independence in thought. You may often analyze situations deeply while also sensing subtle undercurrents others miss. Solitude or mental space is particularly important to your well‑being. When you honor both your logical and intuitive sides, you develop a distinctive perspective that others find insightful and trustworthy.",
          26: "A 26th‑day birthday blends leadership, responsibility, and a protective, family‑minded instinct. You may feel pulled toward roles where you manage resources or people while ensuring stability for those you care about. The challenge lies in balancing authority with empathy so you do not carry everything alone. As you learn to delegate and trust supportive partnerships, your capacity to create secure, prosperous environments grows significantly.",
          27: "Those born on the 27th carry a deeply compassionate, intellectually rich, and globally aware energy. You may feel affinity with diverse cultures, beliefs, or experiences and often seek big‑picture understanding. At times, emotional intensity or idealism can leave you disillusioned, yet this too refines your wisdom. When you combine your heart and mind in service of something meaningful, you become a powerful voice for inclusive vision.",
          28: "A birthday on the 28th infuses you with independent drive, courage, and a capacity for partnership leadership. You often learn about power dynamics through close relationships, business ventures, or collaborative projects. Balancing your desire to lead with a willingness to cooperate is a central life lesson. As you integrate assertiveness with respect for others’ strengths, you become an effective and motivating partner.",
          29: "Born on the 29th, you hold an emotionally sensitive, intuitive, and relationally focused vibration. You may feel particularly affected by the emotional tone of your environments or the well‑being of those close to you. This sensitivity, while sometimes overwhelming, is also a powerful guide to deeper truths. When you learn to protect your energy while staying open‑hearted, you offer profound emotional insight and support.",
          30: "A 30th‑day birth amplifies themes of expression, joy, and creative communication. You may feel compelled to share ideas, stories, or art with a broader audience, even if you start quietly. Periods of self‑doubt about your worth or talent can arise, yet they are invitations to more authentic self‑acceptance. As you embrace your unique voice and allow it to evolve, you become a vivid channel for inspiration and upliftment.",
          31: "Being born on the 31st brings together practicality, creativity, and a methodical approach to building your visions. You are often capable of turning imaginative ideas into concrete outcomes through disciplined effort. At times you might feel torn between safety and innovation, but this tension sharpens your discernment. When you trust both your ingenuity and your work ethic, you become a highly capable creator of solid, well‑designed results.",
        },
      };

      const remedies = {
        lifePath: {
          1: {
            overall:
              "To harmonize a 1 Life Path, regularly set clear, self-chosen goals and move toward them with steady, focused action. This path asks you to embrace leadership without sliding into isolation or defensiveness, especially when you feel misunderstood. The more you balance initiative with humility and listening, the more your natural authority is welcomed rather than resisted. Over time, your life becomes a testament to what is possible when courage and personal responsibility work together.",
            love:
              "In love, a 1 Life Path thrives when there is mutual respect, emotional honesty, and room to breathe. You are drawn to partners who recognize your need for autonomy yet still meet you as an equal, not a follower. The remedy is to soften any tendency to dominate or to shut down when you feel vulnerable, and instead practice clear, collaborative communication. When you allow your partner to see both your strength and your sensitivity, relationships become a powerful arena for shared leadership instead of silent competition.",
            career:
              "Professionally, you flourish in roles that allow you to initiate, innovate, or steer projects without heavy micromanagement. Entrepreneurial paths, leadership tracks, or positions where you can own outcomes suit your drive, provided you also learn to delegate instead of doing everything alone. A practical remedy is to develop project management and people skills alongside your vision, so your ideas actually land in the world. Regularly revisiting and refining your goals keeps your ambition sharp and aligned rather than scattered or reactive.",
            growth:
              "For overall growth, build a rhythm of intentional action paired with self-reflection. Practices like journaling, coaching, or periodic strategy sessions with yourself help you see where you are leading from inspiration versus ego. Physical movement that feels empowering—strength training, martial arts, or dynamic sports—can also regulate your energy. The more you consciously direct your willpower toward meaningful aims, the less you feel pushed around by external pressures or old stories.",
          },
          2: {
            overall:
              "For a 2 Life Path, emotional balance and healthy boundaries form the core remedy. You are learning to honor your own needs as much as you honor harmony and partnership, rather than disappearing into other people’s stories. Small, consistent acts of self-advocacy teach your nervous system that it is safe to be both kind and clear. As you practice this, your sensitivity becomes a refined strength instead of a source of overwhelm.",
            love:
              "In relationships, a 2 Life Path is deeply loyal, attentive, and emotionally responsive. You often sense your partner’s needs before they speak, which can create beautiful intimacy but also a pattern of over-giving. The remedy is to name your own feelings and desires clearly instead of hoping others will intuit them as you do. When you practice reciprocal vulnerability and avoid smoothing over every conflict, love becomes a space of genuine partnership rather than quiet self-sacrifice.",
            career:
              "At work, you excel in cooperative environments where listening, mediation, and subtle coordination are valued. You may do well in counseling, HR, diplomacy, support roles, or any field where relationships and details matter more than aggressive competition. A remedy for career fulfillment is to claim credit for your contributions and to negotiate fair boundaries around your time. As you value your skills publicly, you attract roles where your sensitivity is recognized as a strength, not an afterthought.",
            growth:
              "For personal growth, your nervous system needs regular, gentle recalibration through calm routines, creative outlets, or time in nature. Mindfulness, breathwork, or soft movement practices help you differentiate between your emotions and those you absorb from others. Learning basic conflict-resolution skills also empowers you to stay present when tension arises instead of retreating. Over time, you discover that you can be both profoundly kind and firmly self-respecting at the same time.",
          },
          3: {
            overall:
              "To support a 3 Life Path, the primary remedy is giving your creativity a consistent, judgment-free outlet. You are meant to speak, write, perform, design, or otherwise express your inner world, not keep it bottled up. Learning to navigate criticism and self-doubt without shutting down allows your natural joy and originality to keep flowing. When you commit to your voice as a long-term practice rather than a passing mood, your life gains color, meaning, and momentum.",
            love:
              "In love, a 3 Life Path brings warmth, humor, and a natural flair for making shared experiences memorable. You are most satisfied with partners who encourage your self-expression and do not shame you for big feelings or creative swings. The remedy is to avoid using charm or distraction to dodge deeper emotional conversations; intimacy grows when you let your partner see what is beneath the jokes. As you share your authentic vulnerabilities alongside your playfulness, your relationships become richer and more resilient.",
            career:
              "Career-wise, you shine wherever communication, ideas, or aesthetics take center stage—writing, design, media, teaching, marketing, or performance are all natural outlets. You may start enthusiastically and then struggle with consistency if a role feels stale or overly rigid. A practical remedy is to create structures—editorial calendars, accountability groups, or steady practice routines—that protect your creativity from procrastination and self-doubt. When discipline supports your gifts, your work can reach a much wider audience.",
            growth:
              "For growth, nurture both sides of your nature: the light and the depth. Journaling, therapy, or honest conversations with trusted friends help you process feelings you might otherwise gloss over. Creative rituals—such as daily pages, sketchbooks, or voice notes—keep your channel open without pressuring every idea to be perfect. Over time, you learn that your emotional truth, even when messy, is the very fuel that makes your expression magnetic and healing to others.",
          },
          4: {
            overall:
              "For a 4 Life Path, grounding, structure, and patience are both your gifts and your remedies. You are here to build solid foundations, but this does not mean you must carry every burden alone or resist all change. Allowing gradual flexibility within your routines keeps your sense of order from hardening into rigidity. As you balance discipline with openness, you create a life that is not only secure, but also quietly satisfying and spacious.",
            love:
              "In relationships, a 4 Life Path offers reliability, loyalty, and a strong instinct to protect loved ones. You tend to show love through practical support—showing up, fixing problems, and creating stability—sometimes more than through flowery words. The remedy is to balance this by occasionally voicing your feelings directly and allowing some spontaneity into shared plans. When you loosen control just enough to let in surprise and play, your bonds deepen without sacrificing the safety you value.",
            career:
              "Professionally, you thrive in roles that demand structure, systems, and follow-through. Engineering, operations, project management, accounting, craftsmanship, and technical trades often resonate with your methodical nature. A remedy for work satisfaction is to guard against burnout from over-responsibility by delegating, pacing yourself, and choosing organizations whose values match your integrity. Long-term, your steady building capacity positions you as a cornerstone in any team or business.",
            growth:
              "For growth, your soul benefits from both routine and small doses of calculated flexibility. Practices like budgeting, time-blocking, and health rituals serve you well, but so do periodic breaks in routine—a new class, travel, or creative hobby that asks nothing of you but enjoyment. Learning to trust that not everything has to be earned through effort softens your edges. As you embrace both discipline and ease, life feels less like a checklist and more like a well-built, lived-in home.",
          },
          5: {
            overall:
              "To balance a 5 Life Path, you are invited to claim freedom consciously rather than chasing it impulsively. You thrive when life includes movement, learning, and variety, but these elements serve you best when guided by clear values. Gentle structure—such as loose plans, healthy habits, and periodic check-ins with your deeper goals—prevents chaos from taking over. Over time, you discover that true freedom is the ability to choose your experiences, not simply react to them.",
            love:
              "In love, a 5 Life Path craves excitement, honesty, and room to evolve. You are attracted to partners who are curious, open-minded, and willing to grow alongside you, rather than those who expect you to stay the same forever. The remedy is to practice transparency about your need for freedom while also honoring your commitments once you make them. When you channel your appetite for novelty into shared adventures and honest dialogue, relationships become a journey rather than an escape route.",
            career:
              "Career-wise, you are suited to dynamic fields with variety, movement, or ongoing learning—sales, travel, media, tech, education, consulting, or any path that resists monotony. You may change roles or industries more than most, which is not a flaw if done consciously rather than impulsively. A remedy is to anchor your choices in a clear sense of personal values and long-term direction, so your flexibility serves your growth instead of scattering it. Systems for managing time, money, and energy keep your lifestyle adventurous but sustainable.",
            growth:
              "For growth, your nervous system benefits from practices that help you pause before acting—mindful breathing, body awareness, or journaling through decisions. Regularly feeding your curiosity through study, travel, or new experiences prevents you from chasing chaos just to feel alive. Detoxing periodically from overstimulation—news, social media, or excess commitments—also keeps your inner compass clear. As you learn to choose change rather than be chased by it, your life becomes a conscious exploration rather than a series of escapes.",
          },
          6: {
            overall:
              "For a 6 Life Path, the central remedy is learning to offer care without losing yourself in the process. You are here to create harmony, beauty, and support, but not to absorb every burden or meet every unspoken expectation. Clarifying your limits, asking for help, and allowing imperfection in your environment all restore balance. As you practice reciprocal care, your nurturing presence becomes both more powerful and more sustainable.",
            love:
              "In love, a 6 Life Path is naturally devoted, romantic, and protective. You are often the one who holds the emotional center of the home, creating beauty, comfort, and a sense of belonging for those you care about. The remedy is to avoid slipping into martyrdom or trying to fix your partner’s every problem at the expense of your own well-being. Healthy relationships for you are built on shared responsibility, appreciation, and the understanding that care must flow in both directions.",
            career:
              "At work, you flourish in roles that combine responsibility with service or aesthetics—teaching, counseling, design, wellness, hospitality, or community leadership all fit your vibration. You are often entrusted with duties others shy away from because you are thorough and genuinely care. A remedy is to negotiate clear boundaries and fair compensation so that your generosity is not taken for granted. When your contributions are valued and not exploited, your ability to uplift people and environments becomes a powerful professional asset.",
            growth:
              "For growth, cultivate practices that nourish you independently of how others are doing—creative hobbies, solo retreats, therapy, or spiritual study. Learning to say no without guilt and to release perfectionism in your home or work life are key remedies. Regular check-ins with yourself about what you are carrying that is not truly yours can prevent quiet resentment from building. As you give yourself permission to be both caring and human, your love becomes even more healing and sustainable.",
          },
          7: {
            overall:
              "To support a 7 Life Path, you need both solitude for reflection and grounded connection with the world. You are designed to question, analyze, and seek deeper truth, but this process is healthiest when anchored in body, nature, and real relationships. Regular practices that quiet your mind and calm your nervous system make your insights clearer and less anxious. Over time, you step into the role of a wise observer who also remembers how to participate fully in life.",
            love:
              "In relationships, a 7 Life Path seeks depth, honesty, and mental or spiritual connection more than constant togetherness. You may need more solitude than most, which can confuse partners who equate closeness with constant contact. The remedy is to explain your need for space as a form of self-maintenance, not rejection, while also making sure you do not retreat so far inward that you become unreachable. When you share your inner world selectively and consistently, intimacy can feel both safe and profoundly meaningful.",
            career:
              "Professionally, you excel in environments that value analysis, research, strategy, or spiritual insight. Science, data, psychology, technology, writing, or holistic disciplines all resonate with your need to understand what lies beneath the surface. A career remedy is to ensure you also have opportunities to apply your insights practically so you do not feel stuck in theory. Building communication skills helps others recognize the value of your depth rather than mistaking your quietness for disinterest.",
            growth:
              "For growth, create a rhythm that honors both contemplation and embodiment. Regular time for study, meditation, or solitary walks nourishes your inner life, while grounding practices such as physical exercise or hands-on crafts keep you connected to the present moment. It can also be healing to engage in small, authentic communities where you can share ideas without pressure to perform. Over time, you realize that your quest for truth is a gift the world genuinely needs, not something to hide.",
          },
          8: {
            overall:
              "For an 8 Life Path, the remedy lies in claiming power as a tool for service, not control or self-worth alone. You are here to learn how to handle money, influence, and responsibility with maturity and heart. Building a clear code of ethics for your ambitions prevents success from feeling hollow or stressful. As you align material goals with deeper purpose, you experience prosperity that feels earned, stable, and genuinely meaningful.",
            love:
              "In love, an 8 Life Path brings loyalty, protectiveness, and a desire to build something substantial together. You may express affection through practical support, problem-solving, and helping your partner feel secure in the material world. The remedy is to temper any tendency toward control, competition, or emotional guardedness, especially during stress. When you allow softness and vulnerability to coexist with your strength, relationships become partnerships of shared power instead of unspoken power struggles.",
            career:
              "Career is a central arena for an 8 Life Path, and you often do well in leadership, business, finance, management, or any field where influence and results matter. You are learning to handle authority, wealth, and responsibility with integrity rather than fear or domination. A key remedy is to define success in a way that includes well-being, relationships, and ethics, not just numbers. Mentorship—both giving and receiving—can refine your leadership style and ensure that your impact is constructive and respected.",
            growth:
              "For growth, it is vital to balance drive with restoration. Practices that help you release tension—such as physical training, breathwork, or time away from performance metrics—allow your system to reset. Reflective tools like values-based goal-setting or periodic life audits keep your ambition aligned with your deeper purpose. As you learn to trust that you are worthy beyond what you produce, you can wield power confidently without becoming hardened by it.",
          },
          9: {
            overall:
              "To harmonize a 9 Life Path, you are invited to transform emotional intensity into compassionate action and creative expression. You feel life deeply, and your remedy is not to numb out, but to give those feelings somewhere constructive to go. Regular processes of release—whether through art, conversation, ritual, or service—keep your heart from becoming weighed down by old stories. As you learn to let go with love, your wisdom becomes a healing presence wherever you go.",
            love:
              "In love, a 9 Life Path is deeply compassionate, idealistic, and often selfless. You are capable of great devotion and may attract partners who are healing or going through transition, sensing your capacity to understand them. The remedy is to avoid confusing unconditional love with accepting unhealthy behavior, and to remember that mutual support is essential. When you choose relationships where empathy is reciprocal and boundaries are honored, your heart can give freely without being depleted.",
            career:
              "Professionally, you are drawn to roles that serve the collective—creative arts, healing, counseling, social impact, education, or advocacy all align with your energy. You may feel restless in work that lacks meaning or seems purely transactional. A remedy is to integrate your humanitarian impulse with practical skills so your contributions are sustainable: think solid training, clear plans, and realistic expectations. This balance allows you to help others without losing yourself in their stories.",
            growth:
              "For growth, your soul benefits from practices that help you process and release the past—therapy, expressive arts, or spiritual rituals of letting go. You often carry a great deal of emotional memory, both personal and collective, and giving it a channel transforms heaviness into wisdom. Engaging with diverse cultures, philosophies, or languages can also feed your broad, inclusive outlook. Over time, you learn that you can care deeply without carrying every burden alone.",
          },
          11: {
            overall:
              "For a Life Path 11, grounding and integration are the core remedies. You are highly sensitive to inspiration and subtle energy, and your system needs calm, predictable supports to carry that voltage. Keeping your physical life—sleep, food, environment—stable makes it easier to trust and work with your intuitive flashes. Over time, you grow into the role of a calm, luminous guide rather than a burned-out visionary.",
            love:
              "In relationships, a Life Path 11 experiences love as a deeply spiritual and intuitive bond. You may sense undercurrents in your partner and the relationship long before anything is spoken, which can be a gift but also overwhelming. The remedy is to communicate your perceptions gently and to avoid assuming that others automatically see what you see. Partnerships that honor your sensitivity while offering grounding, honesty, and practical support are particularly healing.",
            career:
              "Career-wise, you are drawn to paths where inspiration, healing, or vision are central—teaching, counseling, creative arts, spiritual work, coaching, or conscious entrepreneurship all resonate. You may alternate between hiding your gifts and overextending yourself in service. A remedy is to create stable routines, clear schedules, and financial structures that support your sensitivity rather than strain it. When your earthly life is organized, your intuitive and creative capacities can flow more freely and reliably.",
            growth:
              "For growth, grounding practices are non-negotiable: consistent sleep, a calm physical environment, gentle movement, and time away from digital noise help regulate your system. Journaling intuitive impressions, dreams, and ideas keeps them from swirling endlessly in your mind. Seeking mentors or communities that understand spiritual development prevents you from feeling isolated or misunderstood. As you integrate your visionary side with everyday responsibilities, you become a steady light for others rather than a flickering one.",
          },
          22: {
            overall:
              "For a 22 Life Path, pacing and practicality are essential remedies. Your visions are often large, and you are capable of building them, but only when you break them into realistic steps and timelines. Learning to prioritize, delegate, and say no to distractions protects your energy for what truly matters. As you blend inspiration with methodical execution, your work can leave an enduring and positive mark on the world.",
            love:
              "In love, a 22 Life Path looks for a partner who understands the scale of your inner vision and is willing to build something meaningful alongside you. You take commitment seriously and tend to think long-term about home, legacy, and shared impact. The remedy is to share your dreams without pressuring your partner to match your pace, and to allow room for emotional connection beyond practical planning. When both heart and mission are tended, relationships become a sanctuary as well as a launchpad.",
            career:
              "Professionally, you are wired to conceive and implement large structures—businesses, organizations, social systems, or body-of-work projects that serve many people. You do well when you can combine big-picture thinking with day-to-day logistics. A remedy is to break your vision into phases, timelines, and realistic milestones, so you do not drown in your own potential. Surrounding yourself with grounded collaborators who complement your strengths also keeps your projects balanced and executable.",
            growth:
              "For growth, it is essential to pace yourself and remember that not every idea must be built immediately. Regularly revisiting your priorities and pruning commitments prevents overwhelm. Practices that connect you to something larger—meditation, service, or time in nature—help you remember that you are a channel for the work, not solely responsible for carrying it. As you learn to move step by step instead of all at once, your capacity to manifest enduring, beneficial structures increases dramatically.",
          },
          33: {
            overall:
              "For a 33 Life Path, strong boundaries and deep self-compassion are non-negotiable remedies. You are wired to care, teach, and heal at a high level, but your gifts require a stable, well-nourished foundation. Saying no, resting, and tending to your own heart are spiritual practices, not luxuries. As you integrate your sensitivity with wise limits, your ability to offer unconditional love becomes both powerful and sustainable.",
            love:
              "In love, a 33 Life Path embodies a rare blend of tenderness, devotion, and intuitive understanding. You often feel called to support your partner’s healing and growth, sometimes sensing their pain even when it is unspoken. The remedy is to avoid slipping into a savior role or staying in connections that continually drain you in the name of compassion. Relationships that honor your care while equally investing in your well-being allow your immense heart to feel cherished rather than used.",
            career:
              "Career-wise, you are drawn to paths of teaching, healing, counseling, spiritual leadership, creative guidance, or any field where you can uplift others at scale. People naturally come to you for reassurance or insight, even informally. A remedy is to cultivate strong professional and energetic boundaries, including clear working hours, fair compensation, and time off from holding space. As you honor your own limits, your ability to serve with consistent, luminous presence becomes far more sustainable.",
            growth:
              "For growth, practice radical self-compassion and rest as seriously as you practice service. Quiet creative time, retreats, therapy, or spiritual study all help you integrate the intense emotional frequencies you often carry. Learning to say no—even to worthy causes—when your system is at capacity is a key remedy. Over time, you discover that your true medicine for the world comes not from self-denial, but from a heart that is full, clear, and firmly rooted in its own worth.",
          },
        },
      };

      const physicalRemedies = {
        1: "1 energy is strengthened by bold, clean lines and time in direct sunlight. Ruby, garnet, or other warm red stones can symbolically support confidence and healthy initiative when used respectfully as reminders, not as magic fixes.",
        2: "2 energy benefits from calm, lunar, and water-based environments. Pearls, moonstone, and soft white or silver tones can act as physical anchors for emotional balance and receptive intuition when worn or placed mindfully.",
        3: "3 energy is brightened by color, music, and gentle social spaces. Yellow sapphire, citrine, or other golden stones can be used as focal points for joy and expressive confidence, especially in creative or communicative work.",
        4: "4 energy stabilizes through earthy routines, minimal clutter, and supportive physical structure. Green stones such as emerald or green aventurine, alongside grounding practices like walking or gardening, help anchor your sense of reliability.",
        5: "5 energy is soothed and focused by movement, travel in moderation, and environments that allow airflow and variety. Multi-colored or changeable stones such as fluorite can serve as reminders to channel change consciously rather than chaotically.",
        6: "6 energy is harmonized by beauty in the home, art, and spaces of comfort. Diamond and clear quartz are classic physical symbols for refined responsibility and high-vibration love, working best when paired with genuine self-care and balanced giving.",
        7: "7 energy attunes well to quiet natural settings, books, and contemplative spaces. Cat’s eye, amethyst, or other introspective stones can be used as touchstones during study, meditation, or spiritual practice to focus your search for truth.",
        8: "8 energy is supported by solid, well-crafted objects, organized workspaces, and symbols of earned achievement. Blue sapphire, onyx, or other deep-toned stones can act as reminders to use power ethically and steadily rather than reactively.",
        9: "9 energy resonates with art, incense, ritual objects, and items tied to service or charity. Red coral, garnet, or richly colored stones can help you remember to transform intense emotion into compassionate action rather than carrying it alone.",
        11: "11 energy benefits from soft lighting, tranquil spaces, and carefully chosen spiritual tools. Clear quartz, moonstone, and other high-vibration stones can amplify your intuition when used alongside grounding practices and not as substitutes for rest.",
        22: "22 energy is reinforced by high-quality tools, planners, and physical structures that support big projects. A combination of grounding stones (like hematite) with vision-oriented ones (like clear quartz) can remind you to blend practicality with inspiration.",
        33: "33 energy is soothed by sacred spaces, altars, or creative studios dedicated to healing and service. Gentle stones such as rose quartz, amethyst, or selenite can symbolize soft, steady compassion—especially when you pair them with firm personal boundaries.",
      };

      function buildReportText(data) {
        const lines = [];
        lines.push("UNIVERSAL NUMEROLOGY ENGINE REPORT");
        lines.push("================================");
        lines.push("");
        lines.push("Name       : " + data.fullName);
        lines.push("Birth Date : " + data.birthDate);
        lines.push("");
        lines.push("CORE NUMBERS");
        lines.push("------------");
        lines.push("");
        lines.push("  • Life Path           : " + data.lifePath);
        lines.push("  • Expression (Destiny): " + data.expression);
        lines.push("  • Soul Urge           : " + data.soul);
        lines.push("  • Personality         : " + data.personality);
        lines.push("  • Birthday            : " + data.birthday);
        lines.push("");
        const py = calculatePersonalYear(data.birthDate);
        const pm = calculatePersonalMonth(data.birthDate);
        const pd = calculatePersonalDay(data.birthDate);
        lines.push("CURRENT CYCLES");
        lines.push("--------------");
        lines.push("");
        lines.push("  • Personal Year  : " + (py || "—"));
        lines.push("  • Personal Month : " + (pm || "—"));
        lines.push("  • Personal Day   : " + (pd || "—"));
        lines.push("");
        lines.push("============================================================");
        lines.push("DETAILED INTERPRETATIONS");
        lines.push("============================================================");
        lines.push("");
        lines.push("LIFE PATH " + data.lifePath);
        lines.push("------------------------------------------------------------");
        lines.push(descriptions.lifePath[data.lifePath] || "");
        lines.push("");
        lines.push("EXPRESSION (DESTINY) " + data.expression);
        lines.push("------------------------------------------------------------");
        lines.push(descriptions.expression[data.expression] || "");
        lines.push("");
        lines.push("  Strengths");
        lines.push(
          "  • " +
            (descriptions.expression[data.expression] ||
              "Expression describes your natural talents and capacities.")
        );
        lines.push("  • Expression " + data.expression + " thrives with consistent, focused practice.");
        lines.push("  Challenges");
        lines.push("  • Over‑identifying with one talent and neglecting supporting skills.");
        lines.push("  • Inconsistency between talent and daily practice.");
        lines.push("  • Seeking external validation over inner alignment.");
        lines.push("  Alignment Tips");
        lines.push("  • Schedule weekly reps for Expression " + data.expression + " strengths.");
        lines.push("  • Pair tasks with Life Path " + data.lifePath + " themes.");
        lines.push("  • Let Soul Urge " + data.soul + " keep motivation authentic.");
        lines.push("");
        lines.push("SOUL URGE (HEART'S DESIRE) " + data.soul);
        lines.push("------------------------------------------------------------");
        lines.push(descriptions.soul[data.soul] || "");
        lines.push("");
        lines.push("  Strengths");
        lines.push(
          "  • " +
            (descriptions.soul[data.soul] || "Soul Urge reveals what truly nourishes you.")
        );
        lines.push("  • Clarifies authentic desires beneath roles and expectations.");
        lines.push("  Challenges");
        lines.push("  • Absorbing others’ emotions and forgetting your own needs.");
        lines.push("  • Self‑silencing to keep peace.");
        lines.push("  • Seeking fulfillment through approval.");
        lines.push("  Alignment Tips");
        lines.push(
          "  • State needs plainly; let Personality " +
            data.personality +
            " support honest presentation."
        );
        lines.push("  • Choose environments that nourish Soul Urge " + data.soul + ".");
        lines.push("  • Integrate with Life Path " + data.lifePath + " for aligned growth.");
        lines.push("");
        lines.push("PERSONALITY " + data.personality);
        lines.push("------------------------------------------------------------");
        lines.push(descriptions.personality[data.personality] || "");
        lines.push("");
        lines.push("  Strengths");
        lines.push(
          "  • " +
            (descriptions.personality[data.personality] ||
              "Personality reflects how you are first experienced.")
        );
        lines.push("  • Helps build trust quickly when aligned with inner truth.");
        lines.push("  Challenges");
        lines.push("  • Masking inner needs behind a rigid persona.");
        lines.push("  • Style–substance mismatch causing misreads.");
        lines.push("  • Over‑curating image at the expense of authenticity.");
        lines.push("  Alignment Tips");
        lines.push("  • Let Soul Urge " + data.soul + " inform presentation choices.");
        lines.push("  • Use small, honest disclosures to bridge perception and reality.");
        lines.push("  • Adjust intentionally in contexts where first impressions matter.");
        lines.push("");
        lines.push("BIRTHDAY " + data.birthday);
        lines.push("------------------------------------------------------------");
        lines.push(descriptions.birthday[data.birthday] || "");
        lines.push("");
        lines.push("  Strengths");
        lines.push(
          "  • " +
            (descriptions.birthday[data.birthday] ||
              "Birthday indicates a focused gift or style.")
        );
        lines.push("  • Offers a reliable talent to apply repeatedly.");
        lines.push("  Challenges");
        lines.push("  • Over‑relying on a single gift while neglecting broader development.");
        lines.push("  • Applying the gift in mismatched contexts.");
        lines.push("  • Infrequent practice causing dormancy.");
        lines.push("  Alignment Tips");
        lines.push("  • Plan weekly applications of your Birthday gift.");
        lines.push("  • Pair with Expression " + data.expression + " to turn talent into output.");
        lines.push("  • Align with Life Path " + data.lifePath + " for long‑term direction.");
        lines.push("");

        // Remedy & alignment section
        const lifePathRemedy = (remedies.lifePath && remedies.lifePath[data.lifePath]) || {};

        // Compute present and missing digits 1–9 from core numbers
        const presentNumbers = new Set();
        if (data.lifePath) presentNumbers.add(data.lifePath);
        if (data.expression) presentNumbers.add(data.expression);
        if (data.soul) presentNumbers.add(data.soul);
        if (data.personality) presentNumbers.add(data.personality);
        if (data.birthday) {
          const reducedBirthday = reduceNumber(data.birthday);
          if (reducedBirthday) presentNumbers.add(reducedBirthday);
        }
        const missing = [];
        for (let i = 1; i <= 9; i++) {
          if (!presentNumbers.has(i)) missing.push(i);
        }
        const missingText =
          missing.length === 0
            ? "All digits from 1 through 9 are represented somewhere in your core chart, so no basic vibration is entirely missing. This usually points to a broad range of innate capacities you can draw from."
            : "The following core digits are not present in your main numbers (Life Path, Expression, Soul Urge, Personality, and reduced Birthday): " +
              missing.join(", ") +
              ". Missing numbers do not indicate lack or misfortune; they simply highlight qualities you may choose to develop more consciously over time.";

        const physicalText =
          physicalRemedies[data.lifePath] ||
          "No specific physical support suggestions are available for this Life Path with the current input, but you can still work with gentle symbolic tools like color, scent, and environment to reinforce your intentions.";

        lines.push("============================================================");
        lines.push("REMEDY, BALANCE & SUPPORT");
        lines.push("============================================================");
        lines.push("");

        lines.push("Overall Alignment");
        lines.push("------------------------------------------------------------");
        lines.push(
          lifePathRemedy.overall ||
            "No specific overall alignment guidance is available for this Life Path value with the current input."
        );
        lines.push("");

        lines.push("Love & Relationships");
        lines.push("------------------------------------------------------------");
        lines.push(
          lifePathRemedy.love ||
            "No specific love and relationship guidance is available for this Life Path value with the current input."
        );
        lines.push("");

        lines.push("Career & Vocation");
        lines.push("------------------------------------------------------------");
        lines.push(
          lifePathRemedy.career ||
            "No specific career and vocation guidance is available for this Life Path value with the current input."
        );
        lines.push("");

        lines.push("Growth & Spiritual Practice");
        lines.push("------------------------------------------------------------");
        lines.push(
          lifePathRemedy.growth ||
            "No specific long-term growth practices are available for this Life Path value with the current input."
        );
        lines.push("");

        lines.push("Number Balance (Missing Digits 1–9)");
        lines.push("------------------------------------------------------------");
        lines.push(missingText);
        lines.push("");

        lines.push("Physical Supports (Stones, Objects, Environment)");
        lines.push("------------------------------------------------------------");
        lines.push(physicalText);
        lines.push("");
        lines.push("OVERVIEW SYNERGY");
        lines.push("------------------------------------------------------------");
        lines.push(
          "  • Expression " +
            data.expression +
            " functions best when directed by Life Path " +
            data.lifePath +
            " themes."
        );
        lines.push(
          "  • Soul Urge " +
            data.soul +
            " is supported when Personality " +
            data.personality +
            " presents your needs clearly."
        );
        lines.push(
          "  • Birthday " +
            data.birthday +
            " acts as a focused talent to apply in both career and relationships."
        );
        lines.push("");

        lines.push("End of Report");
        return lines.join("\\r\\n");
      }

      function saveToLocal(data) {
        try {
          localStorage.setItem("numerologyProfile", JSON.stringify(data));
        } catch (e) {
          console.warn("Unable to save profile:", e);
        }
      }

      function loadFromLocal() {
        try {
          const raw = localStorage.getItem("numerologyProfile");
          if (!raw) return null;
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }

      function updateUI(results) {
        // Summary
        document.getElementById("summary-lifePath").textContent = results.lifePath || "—";
        document.getElementById("summary-expression").textContent = results.expression || "—";
        document.getElementById("summary-soul").textContent = results.soul || "—";
        document.getElementById("summary-personality").textContent = results.personality || "—";
        document.getElementById("summary-birthday").textContent = results.birthday || "—";

        // Detail numbers
        document.getElementById("lifePath-number").textContent = results.lifePath || "—";
        document.getElementById("remedy-lifePath-number").textContent = results.lifePath || "—";
        document.getElementById("love-lifePath-number").textContent = results.lifePath || "—";
        document.getElementById("career-lifePath-number").textContent = results.lifePath || "—";
        document.getElementById("growth-lifePath-number").textContent = results.lifePath || "—";
        document.getElementById("expression-number").textContent = results.expression || "—";
        document.getElementById("soul-number").textContent = results.soul || "—";
        document.getElementById("personality-number").textContent = results.personality || "—";
        document.getElementById("birthday-number").textContent = results.birthday || "—";

        // Descriptions
        document.getElementById("lifePath-description").textContent =
          descriptions.lifePath[results.lifePath] ||
          "Life Path information could not be determined for this input.";

        const remedySet =
          (remedies.lifePath && remedies.lifePath[results.lifePath]) || null;

        const lifePathArticle = document.getElementById("tab-lifePath");
        if (lifePathArticle) {
          let extra = lifePathArticle.querySelector(".lp-extra");
          if (!extra) {
            extra = document.createElement("div");
            extra.className = "lp-extra mt-4 space-y-3 text-sm sm:text-[0.95rem] text-slate-200 leading-relaxed";
            lifePathArticle.appendChild(extra);
          } else {
            extra.innerHTML = "";
          }
          const lpIntegration = document.createElement("div");
          lpIntegration.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Integration With Other Numbers</h3>" +
            "<p class=\"mb-2\">Your Life Path " +
            results.lifePath +
            " sets the long arc of your lessons. Read it together with Expression " +
            results.expression +
            " (tools and talents), Soul Urge " +
            results.soul +
            " (inner motivation), and Personality " +
            results.personality +
            " (first impression) to understand both direction and capacity.</p>";
          const lpPractice = document.createElement("div");
          lpPractice.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Practical Guidance</h3>" +
            "<p>" +
            ((remedySet && remedySet.overall) ||
              "Establish simple routines that align daily choices with your Life Path themes. Periodically review goals and habits to ensure they serve the trajectory indicated by your core number.") +
            "</p>";
          extra.appendChild(lpIntegration);
          extra.appendChild(lpPractice);
        }

        const overallRemedyEl = document.getElementById("remedy-overall-text");
        const loveEl = document.getElementById("love-overall-text");
        const careerEl = document.getElementById("career-overall-text");
        const growthEl = document.getElementById("growth-overall-text");

        if (overallRemedyEl) {
          // Build a structured composite remedy summary including overall, love, career, growth,
          // missing numbers, and physical supports.
          const presentNumbers = new Set();
          if (results.lifePath) presentNumbers.add(results.lifePath);
          if (results.expression) presentNumbers.add(results.expression);
          if (results.soul) presentNumbers.add(results.soul);
          if (results.personality) presentNumbers.add(results.personality);
          if (results.birthday) {
            const reducedBirthday = reduceNumber(results.birthday);
            if (reducedBirthday) presentNumbers.add(reducedBirthday);
          }

          const missing = [];
          for (let i = 1; i <= 9; i++) {
            if (!presentNumbers.has(i)) missing.push(i);
          }

          const missingText =
            missing.length === 0
              ? "All digits from 1 through 9 are represented somewhere in your core chart, so no single basic vibration is entirely missing. This usually means you have a wide range of innate capacities to draw from."
              : "The following core digits are not present in your main numbers (Life Path, Expression, Soul Urge, Personality, and reduced Birthday): " +
                missing.join(", ") +
                ". Missing numbers do not indicate lack or doom; they simply highlight qualities you may develop more consciously over time, such as seeking out experiences or people who embody those vibrations.";

          const physicalText =
            physicalRemedies[results.lifePath] ||
            "No specific physical support suggestions are available for this Life Path with the current input, but you can still work with gentle symbolic tools like color, scent, and environment to reinforce your intentions.";

          const sections = [];
          if (remedySet && remedySet.overall) {
            sections.push(
              "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Overall Alignment</h3>" +
                "<p class=\"mb-3\">" +
                remedySet.overall +
                "</p>"
            );
          }
          if (remedySet && remedySet.love) {
            sections.push(
              "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-rose-300 tracking-wide uppercase mb-1\">Love & Relationships</h3>" +
                "<p class=\"mb-3\">" +
                remedySet.love +
                "</p>"
            );
          }
          if (remedySet && remedySet.career) {
            sections.push(
              "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-sky-300 tracking-wide uppercase mb-1\">Career & Vocation</h3>" +
                "<p class=\"mb-3\">" +
                remedySet.career +
                "</p>"
            );
          }
          if (remedySet && remedySet.growth) {
            sections.push(
              "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-amber-300 tracking-wide uppercase mb-1\">Growth & Spiritual Practice</h3>" +
                "<p class=\"mb-3\">" +
                remedySet.growth +
                "</p>"
            );
          }

          sections.push(
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Number Balance</h3>" +
              "<p class=\"mb-3\">" +
              missingText +
              "</p>"
          );
          sections.push(
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Physical Supports</h3>" +
              "<p>" +
              physicalText +
              "</p>"
          );

          overallRemedyEl.innerHTML =
            sections.join("") ||
            "<p>No specific remedy is available for this Life Path value with the current input.</p>";
        }
        if (loveEl) {
          if (remedySet && remedySet.love) {
            loveEl.textContent = remedySet.love;
          } else {
            loveEl.textContent =
              "In love and close relationships, your Life Path " +
              results.lifePath +
              " sets the tone for how you move through partnership, while your Soul Urge " +
              results.soul +
              " reveals what you privately need to feel emotionally safe and fulfilled. Reading both sections together in this report will give you a nuanced picture of how you give and receive love, what attracts you, and which dynamics tend to repeat for you.";
          }
        }
        const loveArticle = document.getElementById("tab-love");
        if (loveArticle) {
          let extra = loveArticle.querySelector(".love-extra");
          if (!extra) {
            extra = document.createElement("div");
            extra.className = "love-extra mt-4 space-y-3 text-sm sm:text-[0.95rem] text-slate-200 leading-relaxed";
            loveArticle.appendChild(extra);
          } else {
            extra.innerHTML = "";
          }
          const loveComm = document.createElement("div");
          loveComm.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-rose-300 tracking-wide uppercase mb-1\">Communication Styles</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Let Soul Urge " +
            results.soul +
            " guide how you express needs and receive affection.</li>" +
            "<li>Use Personality " +
            results.personality +
            " to set a welcoming first impression without masking deeper feelings.</li>" +
            "<li>Match pace and expectations with Life Path " +
            results.lifePath +
            " to avoid mismatched timing in intimacy.</li>" +
            "</ul>";
          const loveBounds = document.createElement("div");
          loveBounds.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Boundaries & Safety</h3>" +
            "<p>Use Expression " +
            results.expression +
            " to define daily acts of care and clear agreements. Align routine closeness with the lessons of Life Path " +
            results.lifePath +
            " so connection feels secure and growth‑oriented.</p>";
          const lovePractice = document.createElement("div");
          lovePractice.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Shared Practices</h3>" +
            "<p>" +
            ((remedySet && remedySet.growth) ||
              "Choose a simple weekly ritual—walks, check‑ins, creative time—that nourishes both partners and keeps the relationship aligned with your core numbers.") +
            "</p>";
          extra.appendChild(loveComm);
          extra.appendChild(loveBounds);
          extra.appendChild(lovePractice);
        }
        if (careerEl) {
          if (remedySet && remedySet.career) {
            careerEl.textContent = remedySet.career;
          } else {
            careerEl.textContent =
              "In career and vocation, your Life Path " +
              results.lifePath +
              " describes the kind of journey and lessons you meet through work, and your Expression " +
              results.expression +
              " outlines the concrete talents and capacities you naturally bring to any role. When you align daily tasks with your Expression and long-term direction with your Life Path, you create a trajectory where effort feels meaningful instead of purely transactional.";
          }
        }
        const careerArticle = document.getElementById("tab-career");
        if (careerArticle) {
          let extra = careerArticle.querySelector(".career-extra");
          if (!extra) {
            extra = document.createElement("div");
            extra.className = "career-extra mt-4 space-y-3 text-sm sm:text-[0.95rem] text-slate-200 leading-relaxed";
            careerArticle.appendChild(extra);
          } else {
            extra.innerHTML = "";
          }
          const carThemes = document.createElement("div");
          carThemes.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-sky-300 tracking-wide uppercase mb-1\">Work Themes</h3>" +
            "<p>Let Expression " +
            results.expression +
            " shape daily tasks, while Life Path " +
            results.lifePath +
            " directs long‑term strategy and timing.</p>";
          const carEnv = document.createElement("div");
          carEnv.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Ideal Environments</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Choose teams and tools that amplify Expression " +
            results.expression +
            " strengths.</li>" +
            "<li>Align metrics and incentives with Life Path " +
            results.lifePath +
            " lessons to avoid burnout.</li>" +
            "<li>Let Personality " +
            results.personality +
            " guide how you present ideas and build trust.</li>" +
            "</ul>";
          const carPlan = document.createElement("div");
          carPlan.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Action Plan</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Weekly skill reps tied to Expression " +
            results.expression +
            " for compounding mastery.</li>" +
            "<li>Quarterly reviews aligned to Life Path " +
            results.lifePath +
            " themes to adjust direction.</li>" +
            "<li>Relational check‑ins using Soul Urge " +
            results.soul +
            " to keep collaboration humane.</li>" +
            "</ul>";
          extra.appendChild(carThemes);
          extra.appendChild(carEnv);
          extra.appendChild(carPlan);
        }
        if (growthEl) {
          if (remedySet && remedySet.growth) {
            growthEl.textContent = remedySet.growth;
          } else {
            growthEl.textContent =
              "For long-term growth, your Life Path " +
              results.lifePath +
              " shows the curriculum your soul signed up for, while your Soul Urge " +
              results.soul +
              " and Personality " +
              results.personality +
              " highlight your inner motivations and outer style. Using these together, you can track which experiences stretch you in a healthy way, which patterns you are ready to release, and which practices in this report will keep you evolving instead of repeating the same lessons.";
          }
        }
        const growthArticle = document.getElementById("tab-growth");
        if (growthArticle) {
          let extra = growthArticle.querySelector(".growth-extra");
          if (!extra) {
            extra = document.createElement("div");
            extra.className = "growth-extra mt-4 space-y-3 text-sm sm:text-[0.95rem] text-slate-200 leading-relaxed";
            growthArticle.appendChild(extra);
          } else {
            extra.innerHTML = "";
          }
          const grPractices = document.createElement("div");
          grPractices.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-amber-300 tracking-wide uppercase mb-1\">Core Practices</h3>" +
            "<p>" +
            ((remedySet && remedySet.growth) ||
              "Pick two stable practices—one reflective and one embodied—and keep them consistent to regulate change and deepen insight.") +
            "</p>";
          const grCurriculum = document.createElement("div");
          grCurriculum.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Curriculum Highlights</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Life Path " +
            results.lifePath +
            " indicates core lessons and timing.</li>" +
            "<li>Soul Urge " +
            results.soul +
            " reveals nourishment required to stay resilient.</li>" +
            "<li>Personality " +
            results.personality +
            " shows how to enter new communities and opportunities.</li>" +
            "</ul>";
          const grConsistency = document.createElement("div");
          grConsistency.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Consistency Plan</h3>" +
            "<p>Use Expression " +
            results.expression +
            " to design simple, repeatable routines. Review quarterly against Life Path " +
            results.lifePath +
            " themes to measure meaningful growth rather than activity alone.</p>";
          extra.appendChild(grPractices);
          extra.appendChild(grCurriculum);
          extra.appendChild(grConsistency);
        }
        document.getElementById("expression-description").textContent =
          descriptions.expression[results.expression] ||
          "Expression information could not be determined for this input.";

        const expressionArticle = document.getElementById("tab-expression");
        if (expressionArticle) {
          let extra = expressionArticle.querySelector(".expr-extra");
          if (!extra) {
            extra = document.createElement("div");
            extra.className = "expr-extra mt-4 space-y-3 text-sm sm:text-[0.95rem] text-slate-200 leading-relaxed";
            expressionArticle.appendChild(extra);
          } else {
            extra.innerHTML = "";
          }
          const exThemes = document.createElement("div");
          exThemes.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-blue tracking-wide uppercase mb-1\">Key Themes</h3>" +
            "<p>" +
            (descriptions.expression[results.expression] || "") +
            "</p>";
          const exIntegration = document.createElement("div");
          exIntegration.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Integration With Life Path</h3>" +
            "<p>Align daily tasks with Life Path " +
            results.lifePath +
            " while using Expression " +
            results.expression +
            " as your toolkit. This pairing clarifies what work feels natural versus draining.</p>";
          const exPractical = document.createElement("div");
          exPractical.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Practical Steps</h3>" +
            "<p>Create simple routines to practice your core talents regularly. Track which activities produce consistent energy and outcomes, and prioritize those.</p>";
          const exChecklist = document.createElement("div");
          exChecklist.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-blue tracking-wide uppercase mb-1\">Strengths</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>" +
            (descriptions.expression[results.expression] || "Your Expression number describes natural talents and capacities.") +
            "</li>" +
            "<li>Expression " +
            results.expression +
            " highlights skills that feel intuitive and energizing when practiced consistently.</li>" +
            "</ul>" +
            "<h3 class=\"mt-3 text-[0.8rem] sm:text-sm font-semibold text-rose-300 tracking-wide uppercase mb-1\">Challenges</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Over‑identifying with one talent and neglecting supporting skills.</li>" +
            "<li>Inconsistency between talent and daily practice creates frustration.</li>" +
            "<li>Letting external validation override inner alignment.</li>" +
            "</ul>" +
            "<h3 class=\"mt-3 text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Alignment Tips</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Schedule weekly reps that directly exercise Expression " +
            results.expression +
            " strengths.</li>" +
            "<li>Pair tasks with Life Path " +
            results.lifePath +
            " themes to maintain direction.</li>" +
            "<li>Use Soul Urge " +
            results.soul +
            " to keep motivation authentic.</li>" +
            "</ul>";
          extra.appendChild(exThemes);
          extra.appendChild(exIntegration);
          extra.appendChild(exPractical);
          extra.appendChild(exChecklist);
        }
        document.getElementById("soul-description").textContent =
          descriptions.soul[results.soul] ||
          "Soul Urge information could not be determined for this input.";

        const soulArticle = document.getElementById("tab-soul");
        if (soulArticle) {
          let extra = soulArticle.querySelector(".soul-extra");
          if (!extra) {
            extra = document.createElement("div");
            extra.className = "soul-extra mt-4 space-y-3 text-sm sm:text-[0.95rem] text-slate-200 leading-relaxed";
            soulArticle.appendChild(extra);
          } else {
            extra.innerHTML = "";
          }
          const soThemes = document.createElement("div");
          soThemes.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Core Longings</h3>" +
            "<p>" +
            (descriptions.soul[results.soul] || "") +
            "</p>";
          const soIntegration = document.createElement("div");
          soIntegration.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Integration With Personality</h3>" +
            "<p>Notice where Personality " +
            results.personality +
            " aligns or differs from Soul Urge " +
            results.soul +
            ". Support environments that let your private needs be honored without forcing a public persona.</p>";
          const soPractice = document.createElement("div");
          soPractice.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-amber-300 tracking-wide uppercase mb-1\">Emotional Practices</h3>" +
            "<p>Use journaling, gentle movement, or time in nature to keep your inner life clear. Share needs with trusted allies to prevent quiet overload.</p>";
          const soChecklist = document.createElement("div");
          soChecklist.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Strengths</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>" +
            (descriptions.soul[results.soul] || "Your Soul Urge reveals what truly nourishes you.") +
            "</li>" +
            "<li>Soul Urge " +
            results.soul +
            " clarifies authentic desires beneath roles and expectations.</li>" +
            "</ul>" +
            "<h3 class=\"mt-3 text-[0.8rem] sm:text-sm font-semibold text-rose-300 tracking-wide uppercase mb-1\">Challenges</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Absorbing others’ emotions and forgetting your own needs.</li>" +
            "<li>Self‑silencing to keep peace or avoid discomfort.</li>" +
            "<li>Seeking fulfillment through approval rather than inner alignment.</li>" +
            "</ul>" +
            "<h3 class=\"mt-3 text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Alignment Tips</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>State needs plainly; let Personality " +
            results.personality +
            " support honest presentation.</li>" +
            "<li>Choose environments that regularly nourish Soul Urge " +
            results.soul +
            " (calm, beauty, truth).</li>" +
            "<li>Integrate with Life Path " +
            results.lifePath +
            " to keep desire aligned with growth.</li>" +
            "</ul>";
          extra.appendChild(soThemes);
          extra.appendChild(soIntegration);
          extra.appendChild(soPractice);
          extra.appendChild(soChecklist);
        }
        document.getElementById("personality-description").textContent =
          descriptions.personality[results.personality] ||
          "Personality information could not be determined for this input.";

        const personalityArticle = document.getElementById("tab-personality");
        if (personalityArticle) {
          let extra = personalityArticle.querySelector(".pers-extra");
          if (!extra) {
            extra = document.createElement("div");
            extra.className = "pers-extra mt-4 space-y-3 text-sm sm:text-[0.95rem] text-slate-200 leading-relaxed";
            personalityArticle.appendChild(extra);
          } else {
            extra.innerHTML = "";
          }
          const peThemes = document.createElement("div");
          peThemes.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-fuchsia-300 tracking-wide uppercase mb-1\">Public Style</h3>" +
            "<p>" +
            (descriptions.personality[results.personality] || "") +
            "</p>";
          const peIntegration = document.createElement("div");
          peIntegration.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Integration With Soul Urge</h3>" +
            "<p>Balance how you appear with what you need. Let Personality " +
            results.personality +
            " serve Soul Urge " +
            results.soul +
            " so first impressions reflect real authenticity.</p>";
          const pePractice = document.createElement("div");
          pePractice.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-sky-300 tracking-wide uppercase mb-1\">Practical Adjustments</h3>" +
            "<p>Choose attire, language, and settings that support your preferred way of being seen while staying true to your inner motivations.</p>";
          const peChecklist = document.createElement("div");
          peChecklist.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-fuchsia-300 tracking-wide uppercase mb-1\">Strengths</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>" +
            (descriptions.personality[results.personality] || "Your Personality reflects how you are first experienced.") +
            "</li>" +
            "<li>Personality " +
            results.personality +
            " can make trust‑building faster when aligned with inner truth.</li>" +
            "</ul>" +
            "<h3 class=\"mt-3 text-[0.8rem] sm:text-sm font-semibold text-rose-300 tracking-wide uppercase mb-1\">Challenges</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Masking inner needs behind a rigid persona.</li>" +
            "<li>Being misread due to style–substance mismatch.</li>" +
            "<li>Over‑curating image at the expense of authenticity.</li>" +
            "</ul>" +
            "<h3 class=\"mt-3 text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Alignment Tips</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Let Soul Urge " +
            results.soul +
            " gently inform presentation choices.</li>" +
            "<li>Use small, honest disclosures to bridge perception and reality.</li>" +
            "<li>Revisit life contexts where first impressions matter and adjust intentionally.</li>" +
            "</ul>";
          extra.appendChild(peThemes);
          extra.appendChild(peIntegration);
          extra.appendChild(pePractice);
          extra.appendChild(peChecklist);
        }
        document.getElementById("birthday-description").textContent =
          descriptions.birthday[results.birthday] ||
          "Birthday information could not be determined for this input.";

        const birthdayArticle = document.getElementById("tab-birthday");
        if (birthdayArticle) {
          let extra = birthdayArticle.querySelector(".bd-extra");
          if (!extra) {
            extra = document.createElement("div");
            extra.className = "bd-extra mt-4 space-y-3 text-sm sm:text-[0.95rem] text-slate-200 leading-relaxed";
            birthdayArticle.appendChild(extra);
          } else {
            extra.innerHTML = "";
          }
          const bdThemes = document.createElement("div");
          bdThemes.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-sky-300 tracking-wide uppercase mb-1\">Gift Focus</h3>" +
            "<p>" +
            (descriptions.birthday[results.birthday] || "") +
            "</p>";
          const bdIntegration = document.createElement("div");
          bdIntegration.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Integration With Expression</h3>" +
            "<p>Use your Birthday gift to amplify Expression " +
            results.expression +
            ". Pair natural talents with practiced skills to create reliable outcomes.</p>";
          const bdPractice = document.createElement("div");
          bdPractice.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Application Ideas</h3>" +
            "<p>Choose one weekly action that showcases your Birthday gift in real life—teaching, creating, organizing, or serving—depending on your number.</p>";
          const bdChecklist = document.createElement("div");
          bdChecklist.innerHTML =
            "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-sky-300 tracking-wide uppercase mb-1\">Strengths</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>" +
            (descriptions.birthday[results.birthday] || "Your Birthday indicates a focused gift or style.") +
            "</li>" +
            "<li>Birthday " +
            results.birthday +
            " offers a reliable talent you can apply repeatedly.</li>" +
            "</ul>" +
            "<h3 class=\"mt-3 text-[0.8rem] sm:text-sm font-semibold text-rose-300 tracking-wide uppercase mb-1\">Challenges</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Over‑relying on a single gift and neglecting broader skill development.</li>" +
            "<li>Applying the gift in mismatched contexts that drain energy.</li>" +
            "<li>Infrequent practice causing the gift to feel dormant.</li>" +
            "</ul>" +
            "<h3 class=\"mt-3 text-[0.8rem] sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase mb-1\">Alignment Tips</h3>" +
            "<ul class=\"list-disc list-inside space-y-1\">" +
            "<li>Plan weekly applications that leverage your Birthday gift.</li>" +
            "<li>Pair with Expression " +
            results.expression +
            " to turn talent into dependable output.</li>" +
            "<li>Align with Life Path " +
            results.lifePath +
            " so the gift serves long‑term direction.</li>" +
            "</ul>";
          extra.appendChild(bdThemes);
          extra.appendChild(bdIntegration);
          extra.appendChild(bdPractice);
          extra.appendChild(bdChecklist);
        }

        // Overview narrative
        const overview = document.getElementById("overview-content");
        overview.innerHTML = "";

        const paraIntro = document.createElement("p");
        paraIntro.textContent =
          "This report weaves together your five primary numerology numbers to give a cohesive picture of your character, motivations, and life themes.";
        overview.appendChild(paraIntro);

        const cyclesWrap = document.createElement("div");
        cyclesWrap.className = "mt-3 border border-lux-border/60 rounded-xl bg-lux-bg/40 p-3";
        const cyTitle = document.createElement("h3");
        cyTitle.className = "text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1";
        cyTitle.textContent = "Current Cycles";
        const cyGrid = document.createElement("div");
        cyGrid.className = "grid sm:grid-cols-3 gap-3 text-sm sm:text-[0.95rem]";
        const pyNum = calculatePersonalYear(results.birthDate);
        const pmNum = calculatePersonalMonth(results.birthDate);
        const pdNum = calculatePersonalDay(results.birthDate);
        const py = document.createElement("div");
        py.innerHTML =
          "<p class=\"text-slate-400 text-[0.7rem] uppercase tracking-[0.16em]\">Personal Year</p>" +
          "<p class=\"text-base font-semibold text-lux-gold-soft\">" +
          (pyNum || "—") +
          "</p>";
        const pm = document.createElement("div");
        pm.innerHTML =
          "<p class=\"text-slate-400 text-[0.7rem] uppercase tracking-[0.16em]\">Personal Month</p>" +
          "<p class=\"text-base font-semibold text-lux-blue\">" +
          (pmNum || "—") +
          "</p>";
        const pd = document.createElement("div");
        pd.innerHTML =
          "<p class=\"text-slate-400 text-[0.7rem] uppercase tracking-[0.16em]\">Personal Day</p>" +
          "<p class=\"text-base font-semibold text-emerald-300\">" +
          (pdNum || "—") +
          "</p>";
        cyGrid.appendChild(py);
        cyGrid.appendChild(pm);
        cyGrid.appendChild(pd);
        cyclesWrap.appendChild(cyTitle);
        cyclesWrap.appendChild(cyGrid);
        overview.appendChild(cyclesWrap);

        const list = document.createElement("ul");
        list.className = "mt-3 space-y-1 list-disc list-inside text-slate-200 text-sm sm:text-[0.95rem]";

        const items = [
          "Life Path " +
            results.lifePath +
            " outlines the overall direction, lessons, and repeating patterns that shape your journey.",
          "Expression " +
            results.expression +
            " describes the natural talents, strengths, and capacities you bring to any situation.",
          "Soul Urge " +
            results.soul +
            " reveals what your heart most deeply craves in order to feel authentic and fulfilled.",
          "Personality " +
            results.personality +
            " reflects how others initially experience you and the traits that stand at the front door of your energy.",
          "Your Birthday Number " +
            results.birthday +
            " highlights a specific gift or focal quality tied to the calendar day you were born.",
        ];

        items.forEach((text) => {
          const li = document.createElement("li");
          li.textContent = text;
          list.appendChild(li);
        });

        overview.appendChild(list);

        const paraClose = document.createElement("p");
        paraClose.className = "mt-3";
        paraClose.textContent =
          "No single number defines you; it is the interaction between these vibrations, plus your free will, that creates your lived reality. Use this information as a mirror, not a limitation, and return to it whenever you seek clarity on your path.";
        overview.appendChild(paraClose);

        const synergy = document.createElement("div");
        synergy.className = "mt-4 space-y-2";
        synergy.innerHTML =
          "<h3 class=\"text-[0.8rem] sm:text-sm font-semibold text-lux-gold-soft tracking-wide uppercase mb-1\">Synergy Highlights</h3>" +
          "<ul class=\"list-disc list-inside space-y-1\">" +
          "<li>Expression " +
          results.expression +
          " functions best when directed by Life Path " +
          results.lifePath +
          " themes.</li>" +
          "<li>Soul Urge " +
          results.soul +
          " is supported when Personality " +
          results.personality +
          " presents your needs clearly.</li>" +
          "<li>Birthday " +
          results.birthday +
          " acts as a focused talent you can apply to both career and relationships for tangible progress.</li>" +
          "</ul>";
        overview.appendChild(synergy);
      }

      function handleCalculation(fullName, birthDate) {
        const lifePath = calculateLifePath(birthDate);
        const birthday = calculateBirthday(birthDate);

        const expression = lettersToNumber(fullName);
        const soul = lettersToNumber(fullName, (c) => VOWELS.has(c));
        const personality = lettersToNumber(
          fullName,
          (c) => /[A-Z]/.test(c) && !VOWELS.has(c)
        );

        const payload = {
          fullName: fullName.trim(),
          birthDate,
          lifePath,
          expression,
          soul,
          personality,
          birthday,
        };
        updateUI(payload);
        saveToLocal(payload);
        return payload;
      }

      document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("numerology-form");
        const loadLastBtn = document.getElementById("loadLastBtn");
        const downloadBtn = document.getElementById("downloadReport");
        const downloadJsonBtn = document.getElementById("downloadJson");

        const tabs = document.querySelectorAll(".tab-button");
        const tabContents = {
          lifePath: document.getElementById("tab-lifePath"),
          expression: document.getElementById("tab-expression"),
          soul: document.getElementById("tab-soul"),
          personality: document.getElementById("tab-personality"),
          birthday: document.getElementById("tab-birthday"),
          overview: document.getElementById("tab-overview"),
          remedy: document.getElementById("tab-remedy"),
          love: document.getElementById("tab-love"),
          career: document.getElementById("tab-career"),
          growth: document.getElementById("tab-growth"),
        };

        function activateTab(target) {
          tabs.forEach((btn) => {
            const isActive = btn.dataset.tab === target;
            btn.classList.toggle("bg-lux-bg-alt/90", isActive);
            btn.classList.toggle("border", isActive);
            btn.classList.toggle("border-lux-gold-soft/60", isActive);
            btn.classList.toggle("text-lux-gold-soft", isActive);
            btn.classList.toggle("text-slate-300", !isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
          });

          Object.entries(tabContents).forEach(([key, el]) => {
            if (!el) return;
            if (key === target) {
              el.classList.add("active");
            } else {
              el.classList.remove("active");
            }
          });
        }

        tabs.forEach((btn) => {
          btn.addEventListener("click", () => {
            activateTab(btn.dataset.tab);
          });
        });

        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const fullName = document.getElementById("fullName").value;
          const birthDate = document.getElementById("birthDate").value;
          if (!fullName.trim() || !birthDate) return;

          handleCalculation(fullName, birthDate);
          activateTab("overview");
        });

        loadLastBtn.addEventListener("click", () => {
          const data = loadFromLocal();
          if (!data) return;
          document.getElementById("fullName").value = data.fullName || "";
          document.getElementById("birthDate").value = data.birthDate || "";
          updateUI(data);
          activateTab("overview");
        });

        downloadBtn.addEventListener("click", () => {
          const data = loadFromLocal();
          const fullName = document.getElementById("fullName").value.trim();
          const birthDate = document.getElementById("birthDate").value;
          let payload = data;
          if (!payload && fullName && birthDate) {
            payload = handleCalculation(fullName, birthDate);
          }
          if (!payload) return;

          const text = buildReportText(payload);
          const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          const safeName = (payload.fullName || "numerology-report").replace(/[^a-z0-9]+/gi, "-");
          a.href = url;
          a.download = safeName.toLowerCase() + "-numerology-report.txt";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });

        downloadJsonBtn.addEventListener("click", () => {
          const data = loadFromLocal();
          const fullName = document.getElementById("fullName").value.trim();
          const birthDate = document.getElementById("birthDate").value;
          let payload = data;
          if (!payload && fullName && birthDate) {
            payload = handleCalculation(fullName, birthDate);
          }
          if (!payload) return;
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          const safeName = (payload.fullName || "numerology-report").replace(/[^a-z0-9]+/gi, "-");
          a.href = url;
          a.download = safeName.toLowerCase() + "-numerology.json";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });

        // Set initial active tab
        activateTab("lifePath");

        // Auto-load last profile on first visit if available
        const existing = loadFromLocal();
        if (existing) {
          document.getElementById("fullName").value = existing.fullName || "";
          document.getElementById("birthDate").value = existing.birthDate || "";
          updateUI(existing);
        }
      });
