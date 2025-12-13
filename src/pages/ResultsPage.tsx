import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ResultsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">Your CV Analysis</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">85 / 100</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 space-y-1">
            <li>Clear structure and readable format</li>
            <li>Strong experience descriptions</li>
            <li>Good action verbs</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Areas for Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 space-y-1">
            <li>Quantify achievements</li>
            <li>Improve summary specificity</li>
            <li>Reorder skills section</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Adding measurable results and refining your summary can increase your score by 5–10 points.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
