import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// - Apply to job ( candidate )
export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  // First, upload the resume
  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  // Insert the application
  const { data: applicationData, error: applicationError } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (applicationError) {
    console.error(applicationError);
    throw new Error("Error submitting Application");
  }

  // Update the job's application count (increment by 1)
  try {
    // First check if the application_count column exists
    const { data: columnCheck, error: columnError } = await supabase
      .from('jobs')
      .select('application_count')
      .eq('id', jobData.job_id)
      .limit(1);

    if (columnError) {
      console.warn("Warning: Could not check application_count column:", columnError);
    } else if (columnCheck && columnCheck.length > 0) {
      // Column exists, try to increment it
      const currentCount = columnCheck[0].application_count || 0;
      const { error: updateError } = await supabase
        .from("jobs")
        .update({ 
          application_count: currentCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq("id", jobData.job_id);

      if (updateError) {
        console.warn("Warning: Could not update job application count:", updateError);
      } else {
        console.log("Successfully updated application count to:", currentCount + 1);
      }
    } else {
      console.log("application_count column doesn't exist, skipping count update");
    }
  } catch (countError) {
    console.warn("Warning: Could not update job application count:", countError);
  }

  return applicationData;
}

// - Edit Application Status ( recruiter )
export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
