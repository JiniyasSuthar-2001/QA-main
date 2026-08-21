/**
 * AI Explanation Engine.
 * Translates structured technical findings into 3 AI user explanation levels (SIMPLE, STANDARD, TECHNICAL).
 */
function generateAIExplanation(finding, level = 'STANDARD') {
  if (!finding) return null;

  const targetLevel = (level || 'STANDARD').toUpperCase();

  let explanation = '';
  let summary = '';
  let actionItem = '';

  switch (targetLevel) {
    case 'SIMPLE':
      // Non-technical business view
      summary = `Non-technical Summary: ${finding.title}`;
      if (finding.category === 'CRASH') {
        explanation = "The app closes suddenly when rotating the screen because internal screen data isn't saved properly.";
        actionItem = "Ask your development team to fix screen rotation stability before releasing to users.";
      } else if (finding.category === 'SECURITY') {
        explanation = "Important security details like secret passwords or unencrypted internet links were left exposed inside the application files.";
        actionItem = "Ask your developers to hide secret keys and enforce secure https:// links.";
      } else if (finding.category === 'NETWORK' || finding.category === 'FUNCTIONAL') {
        explanation = "The app couldn't log in reliably because the server responded with an error during authentication.";
        actionItem = "Check server connection and login services.";
      } else {
        explanation = finding.description;
        actionItem = "Review with quality assurance team.";
      }
      break;

    case 'TECHNICAL':
      // Deep developer stack trace & schema view
      summary = `[DEV-SPEC] ${finding.category} | Severity: ${finding.severity} | Conf: ${finding.confidence}`;
      explanation = `Technical Root Cause:\n${finding.description}\n\nTechnical Metadata:\n${finding.technical_details || 'N/A'}\n\nReproduction Steps:\n${finding.reproduction_steps}`;
      actionItem = `Patch target component in source code and re-run static & dynamic test suite.`;
      break;

    case 'STANDARD':
    default:
      // QA & Product Manager balanced view
      summary = `Issue: ${finding.title} (${finding.severity} Severity)`;
      explanation = `What Happened: ${finding.description}\n\nWhy It Matters: ${finding.impact}\n\nExpected Behavior: ${finding.expected_behavior}\n\nActual Behavior: ${finding.actual_behavior}`;
      actionItem = `Recommend assigning to dev team to resolve ${finding.severity.toLowerCase()} severity finding before production release.`;
      break;
  }

  return {
    level: targetLevel,
    finding_id: finding.id,
    title: finding.title,
    summary,
    explanation,
    actionItem,
    impact: finding.impact,
    evidence_count: finding.evidence ? finding.evidence.length : 0
  };
}

module.exports = { generateAIExplanation };
